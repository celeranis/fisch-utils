_G.grab = function(fish, shiny)
	local fishModel = game.ReplicatedStorage.resources.items.fish[fish][shiny and 'Shiny' or fish]

	local currentFish = workspace:FindFirstChild('CurrentFish')
	if currentFish then
		currentFish:ClearAllChildren()
	else
		currentFish = Instance.new('Folder', workspace)
		currentFish.Name = 'CurrentFish'
	end

	local clone = fishModel:Clone()
	clone.Parent = currentFish
	game.Selection:Set({ clone })
end