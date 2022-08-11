# Clip Complex

Find YouTube channels with clips of your favorite Twitch streamers.

<details>
  <summary>Screenshot</summary>
  
  ![image](https://user-images.githubusercontent.com/9921699/184048059-fa93a2fb-d542-4949-b36f-eb5caad6b309.png)

</details>

Installing:   
```npm i ```  

Running:   
```npm run dev```   

Setting this up (as is) requires Supabase with Twitch auth as well as the ~~included~~ (sorry) express server for getting YT data. 
You also need these environment variables:
```   
VITE_SUPABASE_URL   
VITE_SUPABASE_ANON_KEY
VITE_TWITCH_CLIENT_ID
VITE_TWITCH_BASE_URL=https://api.twitch.tv/helix
VITE_YT_SERVER
```
