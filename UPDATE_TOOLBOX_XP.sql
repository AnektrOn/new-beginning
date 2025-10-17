-- Update toolbox library XP rewards from 15 to 10
UPDATE public.toolbox_library 
SET xp_reward = 10 
WHERE xp_reward = 15;

-- Show the updated results
SELECT title, xp_reward 
FROM public.toolbox_library 
ORDER BY title;
