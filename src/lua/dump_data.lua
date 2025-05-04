local httpEnabledBefore = game.HttpService.HttpEnabled
game.HttpService.HttpEnabled = true

--[[ ABUNDANCE DATA ]]
local zones = workspace.zones.fishing

local zoneMap = {}

for _, zone in ipairs(zones:GetChildren()) do
	local abundance = zone:FindFirstChild('Abundance')
	if not zoneMap[zone.Name] then
		zoneMap[zone.Name] = {
			crab_zones = {},
			abundances = {},
			force_abundance = not not abundance,
			can_lucky = zone:HasTag('cangetlucky')
		}
	end
	local zoneData = zoneMap[zone.Name]
	local crabZone = zone:FindFirstChild('CrabZone')

	if (crabZone and not table.find(zoneData.crab_zones, crabZone.Value)) then
		table.insert(zoneData.crab_zones, crabZone.Value)
	end

	if (zone:HasTag('cangetlucky') and not zoneData.can_lucky) then
		zoneData.can_lucky = true
	end

	if (abundance) then
		local pos = (zone.CFrame * CFrame.new(0, zone.Size.Y / 2, 0)).Position
		table.insert(zoneData.abundances, {
			fish = abundance.Value,
			chance = abundance:FindFirstChild('Chance') and abundance.Chance.Value or nil,
			position = {
				['$type'] = 'Vector3',
				X = pos.X,
				Y = pos.Y,
				Z = pos.Z
			},
			hidden = not zone:HasTag('abundance') or nil,
			can_lucky = zone:HasTag('cangetlucky'),
		})
	else
		zoneData.force_abundance = nil
	end
end

function postData(name, data)
	game.HttpService:RequestAsync({
		Url = 'http://localhost:31471/' .. name .. '.json',
		Method = 'POST',
		Body = game.HttpService:JSONEncode(data)
	})
end

function preprocess(obj)
	if (typeof(obj) == 'Color3') then
		return {
			['$type'] = 'Color3',
			R = math.round(obj.R * 255),
			G = math.round(obj.G * 255),
			B = math.round(obj.B * 255)
		}
	end

	if (typeof(obj) == 'Vector3') then
		return {
			["$type"] = "Vector3",
			X = obj.X,
			Y = obj.Y,
			Z = obj.Z
		}
	end
	
	if (typeof(obj) == 'ColorSequence') then
		local dat = {
			["$type"] = typeof(obj),
			keypoints = {}
		}
		for _, point in ipairs(obj.Keypoints) do
			table.insert(dat.keypoints, {
				time = point.Time,
				value = preprocess(point.Value)
			})
		end
		return dat
	end

	if (typeof(obj) == 'DateTime') then
		return {
			["$type"] = 'DateTime',
			timestamp = obj:ToIsoDate()
		}
	end
	
	if (typeof(obj) == 'Font') then
		return {
			['$type'] = 'Font',
			Family = obj.Family,
			Weight = obj.Weight.Name,
			Style = obj.Style.Name,
		}
	end

	if (typeof(obj) ~= 'table') then return obj end

	if (obj['$type'] == 'noop') then return nil end

	for k, v in pairs(obj) do
		obj[k] = preprocess(v)
	end

	return obj
end

function postModule(modulePath, removeKeys)
	local moduleData = preprocess(require(modulePath))
	for _, key in ipairs(removeKeys) do
		moduleData[key] = nil
	end
	postData(modulePath.Name, moduleData)
end

local modules = game.ReplicatedStorage.shared.modules
local instances = game.ReplicatedStorage.resources.replicated.instances
local currentWorld = game.ReplicatedStorage:GetAttribute('CurrentWorld')

postData(currentWorld == 'Sea 2' and 'abundances_sea2' or 'abundances', zoneMap)

function removeIsServer(parent)
	for _, v in parent:GetDescendants() do
		if v:IsA('LuaSourceContainer') then
			if (#v.Source >= 200000) then
				warn(v:GetFullName(), 'is too long for lua, hopefully no IsServer')
				continue
			end
			v.Source = v.Source
				:gsub('%S+:IsServer%(%)', '--[[not server]] false')
				--[[ ensure we get accurate stats for all rods ]]
				:gsub('table%.find%([%w_]+.Worlds or {}, [%w_]+%) ~= nil', '--[[pretend to be both worlds]] true')
		end
	end
end

--[[ if this is a local file, remove anything reliant on server code ]]
if (game:GetService('RunService'):IsStudio() and game.PlaceId == 0) then
	removeIsServer(workspace)
	removeIsServer(game.ReplicatedStorage)
	removeIsServer(game.ServerStorage)
	removeIsServer(game.StarterGui)
end

--[[ BOAT DATA ]]
local boatFolder = instances.vessels
local boatData = require(modules.vessels).library

for boatName, boatEntry in pairs(boatData) do
	local boatModel = boatFolder:FindFirstChild(boatName)
	if boatModel ~= nil then
		local totalSeats = 0
		local passengerSeats = 0
		boatModel = boatModel:Clone()
		for _, part in boatModel:GetDescendants() do
			if part:IsA('Seat') or part:IsA('VehicleSeat') then
				totalSeats += 1
				if (not part:IsA('VehicleSeat')) then
					passengerSeats += 1
				end
			elseif part:IsA('BasePart') and part.Transparency >= 1 then
				part:Destroy()
			end
		end
		boatEntry.SeatCount = totalSeats
		boatEntry.PassengerSeatCount = passengerSeats
		boatEntry.ModelDimensions = boatModel:GetExtentsSize()
	end
	boatData[boatName] = preprocess(boatEntry)
end
postData('vessels', boatData)

--[[ LANTERN DATA ]]
local lanternFolder = instances.lanterns
local lanternData = require(modules.library.lanterns)

for lanternName, lanternEntry in pairs(lanternData) do
	local lanternModel = lanternFolder.normal:FindFirstChild(lanternName) or lanternFolder.exclusive:FindFirstChild(lanternName)
	if lanternModel ~= nil then
		lanternEntry.Lights = {}
		lanternEntry.Sounds = {}
		for _, v in lanternModel:GetDescendants() do
			if v:IsA('PointLight') then
				table.insert(lanternEntry.Lights, {
					Brightness = v.Brightness,
					Range = v.Range,
					Color = preprocess(v.Color)
				})
			elseif v:IsA('Sound') then
				table.insert(lanternEntry.Sounds, {
					Name = v.Name,
					SoundId = v.SoundId,
					PlaybackSpeed = v.PlaybackSpeed,
					Volume = v.Volume
				})
			end
		end
	end
end
postData('lanterns', lanternData)

--[[ UTILITY ABUNDANCES ]]
local utilityAbundances = {}

local utilityPools = workspace.UtilityPools.UtilityPools
for _, pool in ipairs(utilityPools:GetChildren()) do
	table.insert(utilityAbundances, {
		type = pool.Name,
		fish = pool:FindFirstChild('Abundance') and pool.Abundance.Value,
		position = {
			['$type'] = 'Vector3',
			X = pool.Position.X,
			Y = pool.Position.Y,
			Z = pool.Position.Z,
		},
	})
end

postData(currentWorld == 'Sea 2' and 'utilityPools_sea2' or 'utilityPools', utilityAbundances)

--[[ OTHER DATA ]]
postModule(modules.library.bait, { 'Give' })
postModule(modules.fishing.bobbers, { 'Owns', 'Give' })
postModule(modules.Bundles, {})
postModule(modules.library.eggs, {})
postModule(modules.library.fish.zones.crabzone, {})
postModule(modules.library.daterewards, {})
postModule(modules.library.rods.enchants, { 'LoadVisual' })
postModule(modules.library.fish, { 'ToInteger', 'ToHex' })
postModule(modules.library.items, { 'ToHex', 'ToInteger' })
postModule(modules.LimitedStockItems, {})
postModule(modules.library.locations, {})
postModule(modules.fishing.mutations, { 'MutateModel' })
postModule(modules.library.rods, { 'RegisteredNumberOfRods', 'UnRegistered' })
postModule(modules.library.timeevents, {})
postModule(modules.character.titles, { 'Give', 'Remove' })
postModule(modules.library.treasures, {})
postModule(modules.library.serverboosts, {})
postModule(modules.library.fish.zones, {})
postModule(modules.RodSkins, {})
postModule(modules.SkinCrates, {})
postModule(modules.Utilities, { 'GetUtilityCountByType', 'Give' })
postModule(modules.Worlds, {})

--[[ META ]]
local placeVersion = game.PlaceVersion
local readme = game:FindFirstChild('README')
if placeVersion == 0 and readme then
	placeVersion = tonumber(readme.Source:match('PlaceVersion: (%d+)'))
end

local officialVersion = game.ReplicatedStorage:FindFirstChild('world')
if officialVersion then officialVersion = officialVersion:FindFirstChild('version') end
if officialVersion then officialVersion = officialVersion.Value end

postData('meta', {
	official_version = officialVersion,
	place_version = placeVersion,
})

game.HttpService.HttpEnabled = httpEnabledBefore