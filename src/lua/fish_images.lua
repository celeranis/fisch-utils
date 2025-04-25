--[[ Sets up the lighting conditions used for the wiki's fish images. ]]

game.Lighting.ClockTime = 7.05
game.Lighting.GeographicLatitude = -14.49
game.Lighting.EnvironmentDiffuseScale = 0
game.Lighting.EnvironmentSpecularScale = 0
game.Lighting.GlobalShadows = true
game.Lighting.Ambient = Color3.fromRGB(138, 138, 138)
game.Lighting.OutdoorAmbient = Color3.fromRGB(63, 63, 63)
game.Lighting.Brightness = 2
game.Lighting.ColorShift_Top = Color3.new()
game.Lighting.ColorShift_Bottom = Color3.new()
game.Lighting.ExposureCompensation = 0

local ServerStorage = game:GetService('ServerStorage')
local WorkspaceFolder = Instance.new('Folder')
WorkspaceFolder.Name = 'WorkspaceContent'

for _, v in workspace:GetChildren() do
	if not v:IsA('Camera') and not v:IsA('Terrain') then
		v.Parent = WorkspaceFolder
	end
end

WorkspaceFolder.Parent = ServerStorage

for _, v in game.Lighting:GetDescendants() do
	if v:IsA('PostEffect') and not v:IsA('ColorGradingEffect') and not v:IsA('BloomEffect') then
		v.Enabled = false
	elseif v:IsA('Atmosphere') then
		v:Destroy()
	end
end

for _, v in game.StarterGui:GetChildren() do
	if v:IsA('ScreenGui') then
		v.Enabled = false
	end
end
