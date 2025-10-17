-- Update habits that were converted from toolbox items to use 10 XP instead of 15 XP
UPDATE public.user_habits 
SET xp_reward = 10 
WHERE xp_reward = 15 
AND is_custom = false;

-- Show the updated results
SELECT title, xp_reward, is_custom 
FROM public.user_habits 
WHERE is_custom = false
ORDER BY title;
