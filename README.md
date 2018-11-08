# mdb_nodejs


1. Check number of connections via - db.serverStatus().connections

2. the single most important factor in designing your application schema within MongoDB - Matching the Data access patterns of the application

3. To have transactions in MongoDB - 
   
   a. Have a restructure and work on a single document and take advantage of the Atomic operations(Update, findAndUpdate,           $addToSet, $push)
   
   b. Structure the software in such a way
   
   c. Tolerate eg, in Social Media sitea  
   
4. When to link?

   a. 1:1 => Embed
   
   b. 1:Many => Link from Many ones using embed
   
   c. Many:Many => Link using embed
