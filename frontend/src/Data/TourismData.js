// // --- HELPER FOR IMAGES ---
// const getImg = (keyword) => `https://source.unsplash.com/1600x900/?${keyword},travel`;

// // --- DATA STORE ---
// export const STATE_DATA = {
//   // ================= NORTH INDIA =================
//   "Rajasthan": {
//     name: "Rajasthan",
//     tagline: "The Land of Kings",
//     desc: "A timeless land of golden dunes, majestic forts, and vibrant culture. Experience the grandeur of Rajputana history.",
//     heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1920",
//     videoLoop: "https://media.istockphoto.com/id/1182453667/video/hawa-mahal-jaipur-india.mp4?s=mp4-640x640-is&k=20&c=L_dy9qGFDqJkS5v-sKk6Jk_YgYyXoZ1oZ1oZ1oZ1oZ0=",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Rajasthan.json",
//     stats: { weather: "24°C (Dry)", bestMonth: "Oct - Mar", budget: "₹₹₹ (Luxury)", idealDays: "7-10 Days" },
//     destinations: [
//       { name: "Jaipur", type: "City", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },
//       { name: "Jaisalmer", type: "Desert", img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963" },
//       { name: "Udaipur", type: "Lakes", img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10" }
//     ],
//     food: [
//       { name: "Dal Baati Churma", type: "Veg", img: "https://media.istockphoto.com/id/1292635321/photo/dal-bati-churma-rajasthani-food.jpg?s=612x612&w=0&k=20&c=1" },
//       { name: "Laal Maas", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950" }
//     ],
//     transport: { airport: "Jaipur (JAI)", rail: "Excellent Network", local: ["Auto", "Camel Cart", "Taxi"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "SMS Hospital, Jaipur" }
//   },
  
//   "Uttar Pradesh": {
//     name: "Uttar Pradesh",
//     tagline: "The Heartland of India",
//     desc: "Home to the Taj Mahal and the spiritual capital Varanasi. A journey through the soul of India's history and faith.",
//     heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1920",
//     videoLoop: "", // Add local video path
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttar%20Pradesh.json",
//     stats: { weather: "22°C (Pleasant)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Taj Mahal", type: "Wonder", img: "https://images.unsplash.com/photo-1548013146-72479768bada" },
//       { name: "Varanasi", type: "Spiritual", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc" },
//       { name: "Ayodhya", type: "Pilgrimage", img: "https://images.unsplash.com/photo-1610737248336-681b673629b3" }
//     ],
//     food: [
//       { name: "Tunday Kabab", type: "Non-Veg", img: "https://images.unsplash.com/photo-1606471191009-63994c53433b" },
//       { name: "Banarasi Paan", type: "Veg", img: "https://images.unsplash.com/photo-1599577239023-73132646006e" }
//     ],
//     transport: { airport: "Lucknow (LKO)", rail: "Connected to all India", local: ["Rickshaw", "Metro", "Taxi"] },
//     safety: { police: "112", touristHelpline: "1363", hospital: "Medanta, Lucknow" }
//   },

//   "Jammu and Kashmir": {
//     name: "Jammu and Kashmir",
//     tagline: "Paradise on Earth",
//     desc: "Snow-capped mountains, pristine lakes, and chinars. The crown jewel of India's natural beauty.",
//     heroImage: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1920",
//     videoLoop: "",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jammu%20and%20Kashmir.json",
//     stats: { weather: "15°C (Cool)", bestMonth: "Apr - Oct", budget: "₹₹₹ (High)", idealDays: "6-8 Days" },
//     destinations: [
//       { name: "Dal Lake", type: "Lake", img: "https://images.unsplash.com/photo-1566837945700-30057527ade0" },
//       { name: "Gulmarg", type: "Skiing", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5" }
//     ],
//     food: [
//       { name: "Wazwan", type: "Feast", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46" },
//       { name: "Kahwa", type: "Tea", img: "https://images.unsplash.com/photo-1571732154690-f6d1c3e52999" }
//     ],
//     transport: { airport: "Srinagar (SXR)", rail: "Udhampur-Katra", local: ["Taxi", "Shikara"] },
//     safety: { police: "100", touristHelpline: "1800-180-7002", hospital: "SKIMS, Srinagar" }
//   },

//   "Ladakh": {
//     name: "Ladakh",
//     tagline: "Land of High Passes",
//     desc: "A surreal moonscape of cold deserts, blue lakes, and ancient monasteries. The ultimate adventure.",
//     heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Ladakh.json",
//     stats: { weather: "10°C (Cold)", bestMonth: "Jun - Sep", budget: "₹₹ (Mid)", idealDays: "7-10 Days" },
//     destinations: [
//       { name: "Pangong Tso", type: "Lake", img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd" },
//       { name: "Nubra Valley", type: "Desert", img: "https://images.unsplash.com/photo-1596422323363-d463e2730334" }
//     ],
//     food: [
//       { name: "Thukpa", type: "Soup", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb" },
//       { name: "Momos", type: "Snack", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9" }
//     ],
//     transport: { airport: "Kushok Bakula (IXL)", rail: "None", local: ["Bike Rental", "Taxi"] },
//     safety: { police: "100", touristHelpline: "112", hospital: "SNM Hospital, Leh" }
//   },

//   "Himachal Pradesh": {
//     name: "Himachal Pradesh",
//     tagline: "Unforgettable Himachal",
//     desc: "From the colonial charm of Shimla to the hippie vibes of Kasol, Himachal offers majestic peaks and spiritual sanctuary.",
//     heroImage: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Himachal%20Pradesh.json",
//     stats: { weather: "18°C (Pleasant)", bestMonth: "Mar - Jun", budget: "₹₹ (Mid)", idealDays: "5-7 Days" },
//     destinations: [
//       { name: "Manali", type: "Hill Station", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23" },
//       { name: "Kasol", type: "Nature", img: "https://images.unsplash.com/photo-1593183577717-3165b4499092" }
//     ],
//     food: [
//       { name: "Dham", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027" }
//     ],
//     transport: { airport: "Bhuntar (KUU)", rail: "Toy Train", local: ["Bus", "Taxi"] },
//     safety: { police: "100", touristHelpline: "112", hospital: "IGMC, Shimla" }
//   },

//   "Uttarakhand": {
//     name: "Uttarakhand",
//     tagline: "Simply Heaven",
//     desc: "The Yoga Capital of the World and home to the sacred Char Dham. Experience river rafting and wildlife.",
//     heroImage: "https://images.unsplash.com/photo-1572883454114-1cf0031100f8?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttaranchal.json",
//     stats: { weather: "20°C (Pleasant)", bestMonth: "Mar - Jun", budget: "₹₹ (Mid)", idealDays: "5-7 Days" },
//     destinations: [
//       { name: "Rishikesh", type: "Yoga", img: "https://images.unsplash.com/photo-1589539384770-3660fb26f436" },
//       { name: "Kedarnath", type: "Pilgrimage", img: "https://images.unsplash.com/photo-1619842499387-e234c9c737c3" }
//     ],
//     food: [
//       { name: "Aloo ke Gutke", type: "Veg", img: "https://images.unsplash.com/photo-1606491956689-2ea28c674675" }
//     ],
//     transport: { airport: "Dehradun (DED)", rail: "Connected", local: ["Taxi", "Bus"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS Rishikesh" }
//   },

//   // ================= SOUTH INDIA =================
//   "Kerala": {
//     name: "Kerala",
//     tagline: "God's Own Country",
//     desc: "A tropical paradise of waving palms, backwaters, and ayurvedic healing. Slow down and breathe.",
//     heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Kerala.json",
//     stats: { weather: "28°C (Tropical)", bestMonth: "Sep - Mar", budget: "₹₹₹ (Mid-High)", idealDays: "6 Days" },
//     destinations: [
//       { name: "Alleppey", type: "Backwaters", img: "https://images.unsplash.com/photo-1593693397690-362cb9666c74" },
//       { name: "Munnar", type: "Hills", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236" }
//     ],
//     food: [
//       { name: "Sadhya", type: "Veg", img: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2" },
//       { name: "Fish Molee", type: "Non-Veg", img: "https://images.unsplash.com/photo-1626776876694-96d5b0024976" }
//     ],
//     transport: { airport: "Cochin (COK)", rail: "Scenic Routes", local: ["Ferry", "Auto"] },
//     safety: { police: "100", touristHelpline: "1-800-425-4747", hospital: "Aster Medcity, Kochi" }
//   },

//   "Karnataka": {
//     name: "Karnataka",
//     tagline: "One State, Many Worlds",
//     desc: "From the tech hub of Bangalore to the ruins of Hampi and the coffee hills of Coorg.",
//     heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Karnataka.json",
//     stats: { weather: "27°C (Mod)", bestMonth: "Oct - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Hampi", type: "Ruins", img: "https://images.unsplash.com/photo-1609920658906-8223bd289001" },
//       { name: "Coorg", type: "Coffee", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5" }
//     ],
//     food: [
//       { name: "Mysore Pak", type: "Sweet", img: "https://images.unsplash.com/photo-1616031267572-c23c6d7a424e" },
//       { name: "Bisi Bele Bath", type: "Veg", img: "https://images.unsplash.com/photo-1626132628045-3db3be428d00" }
//     ],
//     transport: { airport: "Bangalore (BLR)", rail: "Good Network", local: ["Metro", "Bus"] },
//     safety: { police: "100", touristHelpline: "100", hospital: "Manipal Hospital" }
//   },

//   "Tamil Nadu": {
//     name: "Tamil Nadu",
//     tagline: "Enchanting Tamil Nadu",
//     desc: "Land of temples, classical arts, and pristine beaches. Discover Dravidian architecture and culture.",
//     heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Tamil%20Nadu.json",
//     stats: { weather: "29°C (Warm)", bestMonth: "Nov - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Meenakshi Temple", type: "Temple", img: "https://images.unsplash.com/photo-1609920658906-8223bd289001" },
//       { name: "Ooty", type: "Hills", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5" }
//     ],
//     food: [
//       { name: "Idli Dosa", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" }
//     ],
//     transport: { airport: "Chennai (MAA)", rail: "Extensive", local: ["Bus", "Auto"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "Apollo, Chennai" }
//   },

//   // ================= WEST INDIA =================
//   "Goa": {
//     name: "Goa",
//     tagline: "Pearl of the Orient",
//     desc: "Sun, sand, spices, and susegad. The ultimate party and relaxation destination of India.",
//     heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Goa.json",
//     stats: { weather: "30°C (Humid)", bestMonth: "Nov - Feb", budget: "₹₹₹ (High)", idealDays: "4 Days" },
//     destinations: [
//       { name: "Palolem", type: "Beach", img: "https://images.unsplash.com/photo-1587923377755-6b8f15d90956" },
//       { name: "Dudhsagar", type: "Waterfall", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" }
//     ],
//     food: [
//       { name: "Vindaloo", type: "Non-Veg", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641" }
//     ],
//     transport: { airport: "Dabolim (GOI)", rail: "Madgaon", local: ["Scooter Rental"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "GMC, Bambolim" }
//   },

//   "Maharashtra": {
//     name: "Maharashtra",
//     tagline: "Unlimited",
//     desc: "From the bustling streets of Mumbai to the ancient caves of Ajanta and Ellora.",
//     heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Maharashtra.json",
//     stats: { weather: "28°C (Humid)", bestMonth: "Oct - Mar", budget: "₹₹₹ (High)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Mumbai", type: "City", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7" },
//       { name: "Ajanta Caves", type: "Heritage", img: "https://images.unsplash.com/photo-1583243534575-f9332204c32b" }
//     ],
//     food: [
//       { name: "Vada Pav", type: "Snack", img: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a" }
//     ],
//     transport: { airport: "Mumbai (BOM)", rail: "Hub", local: ["Local Train", "Metro"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "Lilavati, Mumbai" }
//   },

//   "Gujarat": {
//     name: "Gujarat",
//     tagline: "Vibrant Gujarat",
//     desc: "Home of the Asiatic Lion, the Rann of Kutch, and the world's tallest statue.",
//     heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Gujarat.json",
//     stats: { weather: "30°C (Dry)", bestMonth: "Nov - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Rann of Kutch", type: "Desert", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b" },
//       { name: "Statue of Unity", type: "Monument", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220" }
//     ],
//     food: [
//       { name: "Dhokla", type: "Snack", img: "https://images.unsplash.com/photo-1606491956689-2ea28c674675" }
//     ],
//     transport: { airport: "Ahmedabad (AMD)", rail: "Good", local: ["Bus", "Auto"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "Apollo, Ahmedabad" }
//   },

//   // ================= EAST INDIA =================
//   "West Bengal": {
//     name: "West Bengal",
//     tagline: "Beautiful Bengal",
//     desc: "Where culture meets intellect. From the colonial charm of Kolkata to the tea gardens of Darjeeling.",
//     heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/West%20Bengal.json",
//     stats: { weather: "27°C (Humid)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Kolkata", type: "City", img: "https://images.unsplash.com/photo-1558431382-27e303142255" },
//       { name: "Darjeeling", type: "Hills", img: "https://images.unsplash.com/photo-1544634076-a90160219459" }
//     ],
//     food: [
//       { name: "Rosogolla", type: "Sweet", img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848" }
//     ],
//     transport: { airport: "Kolkata (CCU)", rail: "Major Hub", local: ["Tram", "Metro"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "AMRI, Kolkata" }
//   },

//   "Odisha": {
//     name: "Odisha",
//     tagline: "India's Best Kept Secret",
//     desc: "Land of ancient temples, diverse tribes, and the mighty Chilika Lake.",
//     heroImage: "https://images.unsplash.com/photo-1605427889502-3d71249405c6?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Odisha.json",
//     stats: { weather: "28°C (Humid)", bestMonth: "Oct - Mar", budget: "₹ (Low)", idealDays: "4 Days" },
//     destinations: [
//       { name: "Konark Sun Temple", type: "Heritage", img: "https://images.unsplash.com/photo-1605427889502-3d71249405c6" },
//       { name: "Puri", type: "Beach/Temple", img: "https://images.unsplash.com/photo-1575489424436-07e15cb99b24" }
//     ],
//     food: [
//       { name: "Dalma", type: "Veg", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7" }
//     ],
//     transport: { airport: "Bhubaneswar (BBI)", rail: "Connected", local: ["Auto", "Bus"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS, Bhubaneswar" }
//   },

//   // ================= NORTH EAST =================
//   "Assam": {
//     name: "Assam",
//     tagline: "Awesome Assam",
//     desc: "Gateway to the North East. Home of the One-horned Rhino and the mighty Brahmaputra.",
//     heroImage: "https://images.unsplash.com/photo-1599577239023-73132646006e?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Assam.json",
//     stats: { weather: "25°C (Wet)", bestMonth: "Oct - Apr", budget: "₹₹ (Mid)", idealDays: "5 Days" },
//     destinations: [
//       { name: "Kaziranga", type: "Wildlife", img: "https://images.unsplash.com/photo-1577002773456-6e5a2a297926" },
//       { name: "Majuli", type: "Island", img: "https://images.unsplash.com/photo-1623164344583-6df29c299949" }
//     ],
//     food: [
//       { name: "Masor Tenga", type: "Fish", img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65" }
//     ],
//     transport: { airport: "Guwahati (GAU)", rail: "Hub", local: ["Ferry", "Bus"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "GMCH, Guwahati" }
//   },

//   "Meghalaya": {
//     name: "Meghalaya",
//     tagline: "Abode of Clouds",
//     desc: "Living root bridges, waterfalls, and the cleanest village in Asia.",
//     heroImage: "https://images.unsplash.com/photo-1592345279419-959d784e8aad?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Meghalaya.json",
//     stats: { weather: "18°C (Wet)", bestMonth: "Oct - Apr", budget: "₹₹ (Mid)", idealDays: "4 Days" },
//     destinations: [
//       { name: "Cherrapunji", type: "Nature", img: "https://images.unsplash.com/photo-1592345279419-959d784e8aad" },
//       { name: "Dawki River", type: "River", img: "https://images.unsplash.com/photo-1594902264560-60b6c226422d" }
//     ],
//     food: [
//       { name: "Jadoh", type: "Rice", img: "https://images.unsplash.com/photo-1604152135912-04a022e23696" }
//     ],
//     transport: { airport: "Shillong (SHL)", rail: "Guwahati", local: ["Taxi"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "Civil Hospital, Shillong" }
//   },

//   // ================= CENTRAL INDIA =================
//   "Madhya Pradesh": {
//     name: "Madhya Pradesh",
//     tagline: "The Heart of Incredible India",
//     desc: "Tiger reserves, ancient temples of Khajuraho, and historic forts.",
//     heroImage: "https://images.unsplash.com/photo-1600100598284-47cd9e285a6e?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Madhya%20Pradesh.json",
//     stats: { weather: "28°C (Warm)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "6 Days" },
//     destinations: [
//       { name: "Khajuraho", type: "Heritage", img: "https://images.unsplash.com/photo-1600100598284-47cd9e285a6e" },
//       { name: "Kanha NP", type: "Wildlife", img: "https://images.unsplash.com/photo-1549366021-9f761d450615" }
//     ],
//     food: [
//       { name: "Poha Jalebi", type: "Snack", img: "https://images.unsplash.com/photo-1626132628045-3db3be428d00" }
//     ],
//     transport: { airport: "Indore (IDR)", rail: "Central Hub", local: ["Bus"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "Bhopal Memorial Hospital" }
//   },

//   // ================= UNION TERRITORIES =================
//   "Delhi": {
//     name: "Delhi",
//     tagline: "Dilwalon ki Dilli",
//     desc: "The capital city where ancient Mughal history meets modern urban life.",
//     heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Delhi.json",
//     stats: { weather: "25°C (Extreme)", bestMonth: "Oct - Mar", budget: "₹₹₹ (Varied)", idealDays: "3 Days" },
//     destinations: [
//       { name: "India Gate", type: "Monument", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
//       { name: "Red Fort", type: "Heritage", img: "https://images.unsplash.com/photo-1598556876373-b771384799a4" }
//     ],
//     food: [
//       { name: "Chole Bhature", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027" }
//     ],
//     transport: { airport: "IGI (DEL)", rail: "NDLS", local: ["Metro", "Uber"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS, Delhi" }
//   },

//   "Andaman and Nicobar Islands": {
//     name: "Andaman and Nicobar Islands",
//     tagline: "Emerald Blue",
//     desc: "Pristine beaches, crystal clear waters, and exotic marine life. The ultimate island getaway.",
//     heroImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1920",
//     mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Andaman%20and%20Nicobar%20Islands.json",
//     stats: { weather: "30°C (Tropical)", bestMonth: "Oct - May", budget: "₹₹₹ (High)", idealDays: "6 Days" },
//     destinations: [
//       { name: "Havelock", type: "Beach", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" },
//       { name: "Radhanagar", type: "Beach", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236" }
//     ],
//     food: [
//       { name: "Seafood", type: "Non-Veg", img: "https://images.unsplash.com/photo-1626776876694-96d5b0024976" }
//     ],
//     transport: { airport: "Port Blair (IXZ)", rail: "None", local: ["Ferry", "Scooter"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "GB Pant Hospital" }
//   }
// };

// // --- DYNAMIC DATA GENERATOR (For states not listed above) ---
// export const getStateData = (stateName) => {
//   // 1. Try exact match
//   if (STATE_DATA[stateName]) return STATE_DATA[stateName];

//   // 2. Try partial match (e.g., "Jammu & Kashmir" vs "Jammu and Kashmir")
//   const key = Object.keys(STATE_DATA).find(k => k.toLowerCase().includes(stateName.toLowerCase()) || stateName.toLowerCase().includes(k.toLowerCase()));
//   if (key) return STATE_DATA[key];

//   // 3. Fallback: Generate Generic Data so the app never crashes
//   return {
//     name: stateName,
//     tagline: `Explore ${stateName}`,
//     desc: `${stateName} is a beautiful region in India known for its rich culture, historical landmarks, and vibrant local life. Discover the hidden gems of this unique destination.`,
//     heroImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1920",
//     videoLoop: "",
//     // Fallback Map URL attempts to find the file dynamically
//     mapUrl: `https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/${stateName}.json`,
//     stats: { 
//       weather: "25°C (Pleasant)", 
//       bestMonth: "Oct - Mar", 
//       budget: "₹₹ (Mid)", 
//       idealDays: "3-5 Days" 
//     },
//     destinations: [
//       { name: "Capital City", type: "City", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236" },
//       { name: "Local Heritage", type: "History", img: "https://images.unsplash.com/photo-1587923377755-6b8f15d90956" }
//     ],
//     food: [
//       { name: "Local Delicacy", type: "Food", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" }
//     ],
//     transport: { airport: "Nearest Airport", rail: "Connected", local: ["Taxi", "Bus"] },
//     safety: { police: "100", touristHelpline: "1363", hospital: "District Hospital" }
//   };
// };


// --- HELPER FOR IMAGES ---
// Note: source.unsplash.com is deprecated, using direct reliable IDs where possible
const getImg = (keyword) => `https://images.unsplash.com/photo-${keyword}?q=80&w=1600&auto=format&fit=crop`;

export const STATE_DATA = {
  // ================= NORTH INDIA =================
  "Rajasthan": {
    name: "Rajasthan",
    tagline: "The Land of Kings",
    desc: "A timeless land of golden dunes, majestic forts, and vibrant culture. Experience the grandeur of Rajputana history in every stone and grain of sand.",
    heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1920",
    videoLoop: "", 
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Rajasthan.json",
    stats: { weather: "24°C (Dry)", bestMonth: "Oct - Mar", budget: "₹₹₹ (Luxury)", idealDays: "7-10 Days" },
    destinations: [
      { name: "Jaipur", type: "City", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800" },
      { name: "Jaisalmer", type: "Desert", img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800" },
      { name: "Udaipur", type: "Lakes", img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=800" }
    ],
    food: [
      { name: "Dal Baati Churma", type: "Veg", img: "https://images.unsplash.com/photo-1630409346824-4f0e7b0400f4?q=80&w=800" },
      { name: "Laal Maas", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800" }
    ],
    transport: { airport: "Jaipur (JAI)", rail: "Excellent Network", local: ["Auto", "Camel Cart", "Taxi"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "SMS Hospital, Jaipur" }
  },

  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    tagline: "The Heartland of India",
    desc: "Home to the Taj Mahal and the spiritual capital Varanasi. A journey through the soul of India's history, faith, and architectural marvels.",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttar%20Pradesh.json",
    stats: { weather: "22°C (Pleasant)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Taj Mahal", type: "Wonder", img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800" },
      { name: "Varanasi", type: "Spiritual", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800" },
      { name: "Ayodhya", type: "Pilgrimage", img: "https://images.unsplash.com/photo-1610737248336-681b673629b3?q=80&w=800" }
    ],
    food: [
      { name: "Tunday Kabab", type: "Non-Veg", img: "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800" },
      { name: "Banarasi Paan", type: "Veg", img: "https://images.unsplash.com/photo-1571389659654-e6749320875c?q=80&w=800" }
    ],
    transport: { airport: "Lucknow (LKO)", rail: "Connected to all India", local: ["Rickshaw", "Metro", "Taxi"] },
    safety: { police: "112", touristHelpline: "1363", hospital: "Medanta, Lucknow" }
  },

  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    tagline: "Paradise on Earth",
    desc: "Snow-capped mountains, pristine lakes, and chinars. The crown jewel of India's natural beauty offering serenity and adventure.",
    heroImage: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Jammu%20and%20Kashmir.json",
    stats: { weather: "15°C (Cool)", bestMonth: "Apr - Oct", budget: "₹₹₹ (High)", idealDays: "6-8 Days" },
    destinations: [
      { name: "Dal Lake", type: "Lake", img: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800" },
      { name: "Gulmarg", type: "Skiing", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800" }
    ],
    food: [
      { name: "Wazwan", type: "Feast", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800" },
      { name: "Kahwa", type: "Tea", img: "https://images.unsplash.com/photo-1596464522204-62923594e92e?q=80&w=800" }
    ],
    transport: { airport: "Srinagar (SXR)", rail: "Udhampur-Katra", local: ["Taxi", "Shikara"] },
    safety: { police: "100", touristHelpline: "1800-180-7002", hospital: "SKIMS, Srinagar" }
  },

  "Ladakh": {
    name: "Ladakh",
    tagline: "Land of High Passes",
    desc: "A surreal moonscape of cold deserts, blue lakes, and ancient monasteries. The ultimate adventure for bikers and seekers of peace.",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Ladakh.json",
    stats: { weather: "10°C (Cold)", bestMonth: "Jun - Sep", budget: "₹₹ (Mid)", idealDays: "7-10 Days" },
    destinations: [
      { name: "Pangong Tso", type: "Lake", img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=800" },
      { name: "Nubra Valley", type: "Desert", img: "https://images.unsplash.com/photo-1596422323363-d463e2730334?q=80&w=800" }
    ],
    food: [
      { name: "Thukpa", type: "Soup", img: "https://images.unsplash.com/photo-1625126596956-077227c9f697?q=80&w=800" },
      { name: "Momos", type: "Snack", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=800" }
    ],
    transport: { airport: "Kushok Bakula (IXL)", rail: "None", local: ["Bike Rental", "Taxi"] },
    safety: { police: "100", touristHelpline: "112", hospital: "SNM Hospital, Leh" }
  },

  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    tagline: "Unforgettable Himachal",
    desc: "From the colonial charm of Shimla to the hippie vibes of Kasol, Himachal offers majestic peaks and spiritual sanctuary.",
    heroImage: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Himachal%20Pradesh.json",
    stats: { weather: "18°C (Pleasant)", bestMonth: "Mar - Jun", budget: "₹₹ (Mid)", idealDays: "5-7 Days" },
    destinations: [
      { name: "Manali", type: "Hill Station", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800" },
      { name: "Kasol", type: "Nature", img: "https://images.unsplash.com/photo-1593183577717-3165b4499092?q=80&w=800" }
    ],
    food: [
      { name: "Dham", type: "Veg", img: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?q=80&w=800" }
    ],
    transport: { airport: "Bhuntar (KUU)", rail: "Toy Train", local: ["Bus", "Taxi"] },
    safety: { police: "100", touristHelpline: "112", hospital: "IGMC, Shimla" }
  },

  "Uttarakhand": {
    name: "Uttarakhand",
    tagline: "Simply Heaven",
    desc: "The Yoga Capital of the World and home to the sacred Char Dham. Experience river rafting, wildlife, and divine spirituality.",
    heroImage: "https://images.unsplash.com/photo-1572883454114-1cf0031100f8?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Uttaranchal.json",
    stats: { weather: "20°C (Pleasant)", bestMonth: "Mar - Jun", budget: "₹₹ (Mid)", idealDays: "5-7 Days" },
    destinations: [
      { name: "Rishikesh", type: "Yoga", img: "https://images.unsplash.com/photo-1589539384770-3660fb26f436?q=80&w=800" },
      { name: "Kedarnath", type: "Pilgrimage", img: "https://images.unsplash.com/photo-1619842499387-e234c9c737c3?q=80&w=800" }
    ],
    food: [
      { name: "Aloo ke Gutke", type: "Veg", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800" }
    ],
    transport: { airport: "Dehradun (DED)", rail: "Connected", local: ["Taxi", "Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS Rishikesh" }
  },

  "Punjab": {
    name: "Punjab",
    tagline: "India Begins Here",
    desc: "A land of golden harvests and the Golden Temple. Known for its warm hospitality, vibrant culture, and delicious cuisine.",
    heroImage: "https://images.unsplash.com/photo-1605332569209-47bb1fb4ee71?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Punjab.json",
    stats: { weather: "25°C (Warm)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "3-4 Days" },
    destinations: [
      { name: "Golden Temple", type: "Spiritual", img: "https://images.unsplash.com/photo-1598556776374-2a6b226f9d3b?q=80&w=800" },
      { name: "Wagah Border", type: "Heritage", img: "https://images.unsplash.com/photo-1594956799002-3c22425626a9?q=80&w=800" }
    ],
    food: [
      { name: "Amritsari Kulcha", type: "Veg", img: "https://images.unsplash.com/photo-1604176354204-9268737828c9?q=80&w=800" },
      { name: "Butter Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" }
    ],
    transport: { airport: "Amritsar (ATQ)", rail: "Excellent", local: ["Auto", "Taxi"] },
    safety: { police: "112", touristHelpline: "1363", hospital: "Fortis, Amritsar" }
  },

  // ================= SOUTH INDIA =================
  "Kerala": {
    name: "Kerala",
    tagline: "God's Own Country",
    desc: "A tropical paradise of waving palms, backwaters, and ayurvedic healing. Slow down and breathe in the serene atmosphere.",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Kerala.json",
    stats: { weather: "28°C (Tropical)", bestMonth: "Sep - Mar", budget: "₹₹₹ (Mid-High)", idealDays: "6 Days" },
    destinations: [
      { name: "Alleppey", type: "Backwaters", img: "https://images.unsplash.com/photo-1593693397690-362cb9666c74?q=80&w=800" },
      { name: "Munnar", type: "Hills", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236?q=80&w=800" }
    ],
    food: [
      { name: "Sadhya", type: "Veg", img: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=800" },
      { name: "Fish Molee", type: "Non-Veg", img: "https://images.unsplash.com/photo-1626776876694-96d5b0024976?q=80&w=800" }
    ],
    transport: { airport: "Cochin (COK)", rail: "Scenic Routes", local: ["Ferry", "Auto"] },
    safety: { police: "100", touristHelpline: "1-800-425-4747", hospital: "Aster Medcity, Kochi" }
  },

  "Karnataka": {
    name: "Karnataka",
    tagline: "One State, Many Worlds",
    desc: "From the tech hub of Bangalore to the ancient ruins of Hampi and the aromatic coffee hills of Coorg.",
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Karnataka.json",
    stats: { weather: "27°C (Mod)", bestMonth: "Oct - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Hampi", type: "Ruins", img: "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=800" },
      { name: "Coorg", type: "Coffee", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800" }
    ],
    food: [
      { name: "Mysore Pak", type: "Sweet", img: "https://images.unsplash.com/photo-1616031267572-c23c6d7a424e?q=80&w=800" },
      { name: "Bisi Bele Bath", type: "Veg", img: "https://images.unsplash.com/photo-1626132628045-3db3be428d00?q=80&w=800" }
    ],
    transport: { airport: "Bangalore (BLR)", rail: "Good Network", local: ["Metro", "Bus"] },
    safety: { police: "100", touristHelpline: "100", hospital: "Manipal Hospital" }
  },

  "Tamil Nadu": {
    name: "Tamil Nadu",
    tagline: "Enchanting Tamil Nadu",
    desc: "Land of living temples, classical arts, and pristine beaches. Discover the rich Dravidian architecture and culture.",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Tamil%20Nadu.json",
    stats: { weather: "29°C (Warm)", bestMonth: "Nov - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Meenakshi Temple", type: "Temple", img: "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=800" },
      { name: "Ooty", type: "Hills", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800" }
    ],
    food: [
      { name: "Idli Dosa", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800" },
      { name: "Chettinad Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800" }
    ],
    transport: { airport: "Chennai (MAA)", rail: "Extensive", local: ["Bus", "Auto"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "Apollo, Chennai" }
  },

  // ================= WEST INDIA =================
  "Goa": {
    name: "Goa",
    tagline: "Pearl of the Orient",
    desc: "Sun, sand, spices, and susegad. The ultimate party and relaxation destination of India with Portuguese heritage.",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Goa.json",
    stats: { weather: "30°C (Humid)", bestMonth: "Nov - Feb", budget: "₹₹₹ (High)", idealDays: "4 Days" },
    destinations: [
      { name: "Palolem", type: "Beach", img: "https://images.unsplash.com/photo-1587923377755-6b8f15d90956?q=80&w=800" },
      { name: "Dudhsagar", type: "Waterfall", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800" }
    ],
    food: [
      { name: "Vindaloo", type: "Non-Veg", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800" },
      { name: "Bebinca", type: "Dessert", img: "https://images.unsplash.com/photo-1629124230677-3e4499426090?q=80&w=800" }
    ],
    transport: { airport: "Dabolim (GOI)", rail: "Madgaon", local: ["Scooter Rental"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "GMC, Bambolim" }
  },

  "Maharashtra": {
    name: "Maharashtra",
    tagline: "Unlimited",
    desc: "From the bustling streets of Mumbai to the ancient caves of Ajanta and Ellora, experience a land of diverse landscapes.",
    heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Maharashtra.json",
    stats: { weather: "28°C (Humid)", bestMonth: "Oct - Mar", budget: "₹₹₹ (High)", idealDays: "5 Days" },
    destinations: [
      { name: "Mumbai", type: "City", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=800" },
      { name: "Ajanta Caves", type: "Heritage", img: "https://images.unsplash.com/photo-1583243534575-f9332204c32b?q=80&w=800" }
    ],
    food: [
      { name: "Vada Pav", type: "Snack", img: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?q=80&w=800" },
      { name: "Misal Pav", type: "Spicy", img: "https://images.unsplash.com/photo-1605553643720-332305596396?q=80&w=800" }
    ],
    transport: { airport: "Mumbai (BOM)", rail: "Hub", local: ["Local Train", "Metro"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "Lilavati, Mumbai" }
  },

  "Gujarat": {
    name: "Gujarat",
    tagline: "Vibrant Gujarat",
    desc: "Home of the Asiatic Lion, the white sands of Rann of Kutch, and the world's tallest statue.",
    heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Gujarat.json",
    stats: { weather: "30°C (Dry)", bestMonth: "Nov - Feb", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Rann of Kutch", type: "Desert", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800" },
      { name: "Statue of Unity", type: "Monument", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800" }
    ],
    food: [
      { name: "Dhokla", type: "Snack", img: "https://images.unsplash.com/photo-1606491956689-2ea28c674675?q=80&w=800" },
      { name: "Thepla", type: "Bread", img: "https://images.unsplash.com/photo-1606491956689-2ea28c674675?q=80&w=800" }
    ],
    transport: { airport: "Ahmedabad (AMD)", rail: "Good", local: ["Bus", "Auto"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "Apollo, Ahmedabad" }
  },

  // ================= EAST INDIA =================
  "West Bengal": {
    name: "West Bengal",
    tagline: "Beautiful Bengal",
    desc: "Where culture meets intellect. From the colonial charm of Kolkata to the misty tea gardens of Darjeeling.",
    heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/West%20Bengal.json",
    stats: { weather: "27°C (Humid)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Kolkata", type: "City", img: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800" },
      { name: "Darjeeling", type: "Hills", img: "https://images.unsplash.com/photo-1544634076-a90160219459?q=80&w=800" }
    ],
    food: [
      { name: "Rosogolla", type: "Sweet", img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
      { name: "Macher Jhol", type: "Fish", img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800" }
    ],
    transport: { airport: "Kolkata (CCU)", rail: "Major Hub", local: ["Tram", "Metro"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "AMRI, Kolkata" }
  },

  "Odisha": {
    name: "Odisha",
    tagline: "India's Best Kept Secret",
    desc: "Land of ancient temples, diverse tribes, and the mighty Chilika Lake. A treasure trove of art and culture.",
    heroImage: "https://images.unsplash.com/photo-1605427889502-3d71249405c6?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Odisha.json",
    stats: { weather: "28°C (Humid)", bestMonth: "Oct - Mar", budget: "₹ (Low)", idealDays: "4 Days" },
    destinations: [
      { name: "Konark Sun Temple", type: "Heritage", img: "https://images.unsplash.com/photo-1605427889502-3d71249405c6?q=80&w=800" },
      { name: "Puri", type: "Beach/Temple", img: "https://images.unsplash.com/photo-1575489424436-07e15cb99b24?q=80&w=800" }
    ],
    food: [
      { name: "Dalma", type: "Veg", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { name: "Chhena Poda", type: "Sweet", img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" }
    ],
    transport: { airport: "Bhubaneswar (BBI)", rail: "Connected", local: ["Auto", "Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS, Bhubaneswar" }
  },

  "Bihar": {
    name: "Bihar",
    tagline: "Blissful Bihar",
    desc: "The cradle of Buddhism and Jainism. Walk in the footsteps of Buddha at Bodh Gaya and explore ancient universities.",
    heroImage: "https://images.unsplash.com/photo-1627832269922-b91c13749727?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Bihar.json",
    stats: { weather: "26°C (Mod)", bestMonth: "Oct - Mar", budget: "₹ (Low)", idealDays: "3-4 Days" },
    destinations: [
      { name: "Bodh Gaya", type: "Spiritual", img: "https://images.unsplash.com/photo-1565022223724-912df232b724?q=80&w=800" },
      { name: "Nalanda", type: "Ruins", img: "https://images.unsplash.com/photo-1627832269922-b91c13749727?q=80&w=800" }
    ],
    food: [
      { name: "Litti Chokha", type: "Veg", img: "https://images.unsplash.com/photo-1633636737373-c60366b37c22?q=80&w=800" }
    ],
    transport: { airport: "Patna (PAT)", rail: "Major Hub", local: ["Auto", "Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "IGIMS, Patna" }
  },

  // ================= NORTH EAST =================
  "Assam": {
    name: "Assam",
    tagline: "Awesome Assam",
    desc: "Gateway to the North East. Home of the One-horned Rhino, lush tea gardens, and the mighty Brahmaputra river.",
    heroImage: "https://images.unsplash.com/photo-1599577239023-73132646006e?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Assam.json",
    stats: { weather: "25°C (Wet)", bestMonth: "Oct - Apr", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Kaziranga", type: "Wildlife", img: "https://images.unsplash.com/photo-1577002773456-6e5a2a297926?q=80&w=800" },
      { name: "Majuli", type: "Island", img: "https://images.unsplash.com/photo-1623164344583-6df29c299949?q=80&w=800" }
    ],
    food: [
      { name: "Masor Tenga", type: "Fish", img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800" },
      { name: "Pitha", type: "Sweet", img: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?q=80&w=800" }
    ],
    transport: { airport: "Guwahati (GAU)", rail: "Hub", local: ["Ferry", "Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "GMCH, Guwahati" }
  },

  "Meghalaya": {
    name: "Meghalaya",
    tagline: "Abode of Clouds",
    desc: "Living root bridges, cascading waterfalls, and the cleanest village in Asia. A nature lover's paradise.",
    heroImage: "https://images.unsplash.com/photo-1592345279419-959d784e8aad?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Meghalaya.json",
    stats: { weather: "18°C (Wet)", bestMonth: "Oct - Apr", budget: "₹₹ (Mid)", idealDays: "4 Days" },
    destinations: [
      { name: "Cherrapunji", type: "Nature", img: "https://images.unsplash.com/photo-1592345279419-959d784e8aad?q=80&w=800" },
      { name: "Dawki River", type: "River", img: "https://images.unsplash.com/photo-1594902264560-60b6c226422d?q=80&w=800" }
    ],
    food: [
      { name: "Jadoh", type: "Rice", img: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800" }
    ],
    transport: { airport: "Shillong (SHL)", rail: "Guwahati", local: ["Taxi"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "Civil Hospital, Shillong" }
  },

  "Sikkim": {
    name: "Sikkim",
    tagline: "Small but Beautiful",
    desc: "Home to Kanchenjunga, organic farming, and colorful monasteries. A peaceful retreat in the Himalayas.",
    heroImage: "https://images.unsplash.com/photo-1588258327988-6933c062c3c6?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Sikkim.json",
    stats: { weather: "15°C (Cool)", bestMonth: "Mar - May", budget: "₹₹ (Mid)", idealDays: "5 Days" },
    destinations: [
      { name: "Gangtok", type: "City", img: "https://images.unsplash.com/photo-1588258327988-6933c062c3c6?q=80&w=800" },
      { name: "Tsomgo Lake", type: "Lake", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800" }
    ],
    food: [
      { name: "Thukpa", type: "Soup", img: "https://images.unsplash.com/photo-1625126596956-077227c9f697?q=80&w=800" }
    ],
    transport: { airport: "Pakyong (PYG)", rail: "Siliguri", local: ["Shared Taxi"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "STNM Hospital" }
  },

  // ================= CENTRAL INDIA =================
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    tagline: "The Heart of Incredible India",
    desc: "Tiger reserves, ancient temples of Khajuraho, and historic forts. A central gem of biodiversity and history.",
    heroImage: "https://images.unsplash.com/photo-1600100598284-47cd9e285a6e?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Madhya%20Pradesh.json",
    stats: { weather: "28°C (Warm)", bestMonth: "Oct - Mar", budget: "₹₹ (Mid)", idealDays: "6 Days" },
    destinations: [
      { name: "Khajuraho", type: "Heritage", img: "https://images.unsplash.com/photo-1600100598284-47cd9e285a6e?q=80&w=800" },
      { name: "Kanha NP", type: "Wildlife", img: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=800" }
    ],
    food: [
      { name: "Poha Jalebi", type: "Snack", img: "https://images.unsplash.com/photo-1626132628045-3db3be428d00?q=80&w=800" }
    ],
    transport: { airport: "Indore (IDR)", rail: "Central Hub", local: ["Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "Bhopal Memorial Hospital" }
  },

  // ================= UNION TERRITORIES =================
  "Delhi": {
    name: "Delhi",
    tagline: "Dilwalon ki Dilli",
    desc: "The capital city where ancient Mughal history meets modern urban life. A melting pot of cultures.",
    heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Delhi.json",
    stats: { weather: "25°C (Extreme)", bestMonth: "Oct - Mar", budget: "₹₹₹ (Varied)", idealDays: "3 Days" },
    destinations: [
      { name: "India Gate", type: "Monument", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800" },
      { name: "Red Fort", type: "Heritage", img: "https://images.unsplash.com/photo-1598556876373-b771384799a4?q=80&w=800" }
    ],
    food: [
      { name: "Chole Bhature", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800" },
      { name: "Butter Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" }
    ],
    transport: { airport: "IGI (DEL)", rail: "NDLS", local: ["Metro", "Uber"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "AIIMS, Delhi" }
  },

  "Andaman and Nicobar Islands": {
    name: "Andaman and Nicobar Islands",
    tagline: "Emerald Blue",
    desc: "Pristine beaches, crystal clear waters, and exotic marine life. The ultimate island getaway.",
    heroImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1920",
    mapUrl: "https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/Andaman%20and%20Nicobar%20Islands.json",
    stats: { weather: "30°C (Tropical)", bestMonth: "Oct - May", budget: "₹₹₹ (High)", idealDays: "6 Days" },
    destinations: [
      { name: "Havelock", type: "Beach", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800" },
      { name: "Radhanagar", type: "Beach", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236?q=80&w=800" }
    ],
    food: [
      { name: "Seafood", type: "Non-Veg", img: "https://images.unsplash.com/photo-1626776876694-96d5b0024976?q=80&w=800" }
    ],
    transport: { airport: "Port Blair (IXZ)", rail: "None", local: ["Ferry", "Scooter"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "GB Pant Hospital" }
  }
};

// --- DYNAMIC DATA GENERATOR (For states not listed above) ---
export const getStateData = (stateName) => {
  // if (!stateName) return STATE_DATA["Rajasthan"];

  // 1. Try exact match
  if (STATE_DATA[stateName]) return STATE_DATA[stateName];

  // 2. Try partial match (e.g., "Jammu & Kashmir" vs "Jammu and Kashmir")
  const key = Object.keys(STATE_DATA).find(k => 
    k.toLowerCase().includes(stateName.toLowerCase()) || 
    stateName.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return STATE_DATA[key];

  // 3. Fallback: Generate Generic Data so the app never crashes
  return {
    name: stateName,
    tagline: `Explore ${stateName}`,
    desc: `${stateName} is a beautiful region in India known for its rich culture, historical landmarks, and vibrant local life. Discover the hidden gems of this unique destination.`,
    heroImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1920",
    videoLoop: "",
    // Fallback Map URL attempts to find the file dynamically
    mapUrl: `https://raw.githubusercontent.com/vemve/india_districts_geojson/master/states/${stateName}.json`,
    stats: { 
      weather: "25°C (Pleasant)", 
      bestMonth: "Oct - Mar", 
      budget: "₹₹ (Mid)", 
      idealDays: "3-5 Days" 
    },
    destinations: [
      { name: "Capital City", type: "City", img: "https://images.unsplash.com/photo-1596328906961-6e3427306236?q=80&w=800" },
      { name: "Local Heritage", type: "History", img: "https://images.unsplash.com/photo-1587923377755-6b8f15d90956?q=80&w=800" }
    ],
    food: [
      { name: "Local Delicacy", type: "Food", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800" }
    ],
    transport: { airport: "Nearest Airport", rail: "Connected", local: ["Taxi", "Bus"] },
    safety: { police: "100", touristHelpline: "1363", hospital: "District Hospital" }
  };
};


export const getStateDesc = (stateName) => {
  if (!stateName) return null;
  
  const query = stateName.toLowerCase().trim();

  // Search the array for a matching name (Exact or Partial)
  const match = ALL_INDIAN_DATA.find(item => {
    const itemName = item.name.toLowerCase();
    // Check if query is inside item name OR item name is inside query (handles "Jammu" for "Jammu and Kashmir")
    return itemName.includes(query) || query.includes(itemName);
  });

  // Return the found object, or null if not found
  return match || null;
};
const ALL_INDIAN_DATA = [
  // STATES
  {
    name: "Andhra Pradesh",
    type: "State",
    regions: ["Visakhapatnam", "Tirupati", "Vijayawada", "Araku Valley", "Amaravati"],
    stats: { population: "53 Million", capital: "Amaravati" }
  },
  {
    name: "Arunachal Pradesh",
    type: "State",
    regions: ["Tawang", "Ziro", "Itanagar", "Pasighat", "Bomdila"],
    stats: { population: "1.5 Million", capital: "Itanagar" }
  },
  {
    name: "Assam",
    type: "State",
    regions: ["Guwahati", "Kaziranga", "Majuli", "Tezpur", "Silchar"],
    stats: { population: "35 Million", capital: "Dispur" }
  },
  {
    name: "Bihar",
    type: "State",
    regions: ["Patna", "Gaya", "Nalanda", "Muzaffarpur", "Bhagalpur"],
    stats: { population: "124 Million", capital: "Patna" }
  },
  {
    name: "Chhattisgarh",
    type: "State",
    regions: ["Raipur", "Bastar", "Bilaspur", "Bhilai", "Jagdalpur"],
    stats: { population: "29 Million", capital: "Raipur" }
  },
  {
    name: "Goa",
    type: "State",
    regions: ["Panaji", "Calangute", "Vasco da Gama", "Margao", "Old Goa"],
    stats: { population: "1.5 Million", capital: "Panaji" }
  },
  {
    name: "Gujarat",
    type: "State",
    regions: ["Ahmedabad", "Surat", "Vadodara", "Kutch", "Somnath"],
    stats: { population: "70 Million", capital: "Gandhinagar" }
  },
  {
    name: "Haryana",
    type: "State",
    regions: ["Gurugram", "Faridabad", "Panipat", "Kurukshetra", "Ambala"],
    stats: { population: "29 Million", capital: "Chandigarh" }
  },
  {
    name: "Himachal Pradesh",
    type: "State",
    regions: ["Shimla", "Manali", "Dharamshala", "Dalhousie", "Kasol"],
    stats: { population: "7.5 Million", capital: "Shimla" }
  },
  {
    name: "Jharkhand",
    type: "State",
    regions: ["Ranchi", "Jamshedpur", "Dhanbad", "Deoghar", "Hazaribagh"],
    stats: { population: "38 Million", capital: "Ranchi" }
  },
  {
    name: "Karnataka",
    type: "State",
    regions: ["Bengaluru", "Mysuru", "Hampi", "Coorg", "Mangaluru"],
    stats: { population: "67 Million", capital: "Bengaluru" }
  },
  {
    name: "Kerala",
    type: "State",
    regions: ["Kochi", "Thiruvananthapuram", "Munnar", "Alappuzha", "Wayanad"],
    stats: { population: "35 Million", capital: "Thiruvananthapuram" }
  },
  {
    name: "Madhya Pradesh",
    type: "State",
    regions: ["Bhopal", "Indore", "Gwalior", "Khajuraho", "Ujjain"],
    stats: { population: "85 Million", capital: "Bhopal" }
  },
  {
    name: "Maharashtra",
    type: "State",
    regions: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    stats: { population: "123 Million", capital: "Mumbai" }
  },
  {
    name: "Manipur",
    type: "State",
    regions: ["Imphal", "Loktak", "Ukhrul", "Moirang", "Churachandpur"],
    stats: { population: "3.2 Million", capital: "Imphal" }
  },
  {
    name: "Meghalaya",
    type: "State",
    regions: ["Shillong", "Cherrapunji", "Dawki", "Tura", "Mawlynnong"],
    stats: { population: "3.3 Million", capital: "Shillong" }
  },
  {
    name: "Mizoram",
    type: "State",
    regions: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Mamit"],
    stats: { population: "1.2 Million", capital: "Aizawl" }
  },
  {
    name: "Nagaland",
    type: "State",
    regions: ["Kohima", "Dimapur", "Mokokchung", "Mon", "Wokha"],
    stats: { population: "2.2 Million", capital: "Kohima" }
  },
  {
    name: "Odisha",
    type: "State",
    regions: ["Bhubaneswar", "Puri", "Cuttack", "Konark", "Rourkela"],
    stats: { population: "45 Million", capital: "Bhubaneswar" }
  },
  {
    name: "Punjab",
    type: "State",
    regions: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
    stats: { population: "30 Million", capital: "Chandigarh" }
  },
  {
    name: "Rajasthan",
    type: "State",
    regions: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
    stats: { population: "79 Million", capital: "Jaipur" }
  },
  {
    name: "Sikkim",
    type: "State",
    regions: ["Gangtok", "Pelling", "Lachung", "Namchi", "Ravangla"],
    stats: { population: "0.7 Million", capital: "Gangtok" }
  },
  {
    name: "Tamil Nadu",
    type: "State",
    regions: ["Chennai", "Madurai", "Coimbatore", "Ooty", "Mahabalipuram"],
    stats: { population: "76 Million", capital: "Chennai" }
  },
  {
    name: "Telangana",
    type: "State",
    regions: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    stats: { population: "38 Million", capital: "Hyderabad" }
  },
  {
    name: "Tripura",
    type: "State",
    regions: ["Agartala", "Udaipur", "Unakoti", "Dharmanagar", "Ambassa"],
    stats: { population: "4 Million", capital: "Agartala" }
  },
  {
    name: "Uttar Pradesh",
    type: "State",
    regions: ["Lucknow", "Varanasi", "Agra", "Prayagraj", "Noida"],
    stats: { population: "230 Million", capital: "Lucknow" }
  },
  {
    name: "Uttarakhand",
    type: "State",
    regions: ["Dehradun", "Nainital", "Rishikesh", "Mussoorie", "Haridwar"],
    stats: { population: "11 Million", capital: "Dehradun (Winter)" }
  },
  {
    name: "West Bengal",
    type: "State",
    regions: ["Kolkata", "Darjeeling", "Siliguri", "Digha", "Sundarbans"],
    stats: { population: "98 Million", capital: "Kolkata" }
  },

  // UNION TERRITORIES
  {
    name: "Andaman and Nicobar Islands",
    type: "UT",
    regions: ["Port Blair", "Havelock Island", "Neil Island", "Ross Island", "Baratang"],
    stats: { population: "0.4 Million", capital: "Port Blair" }
  },
  {
    name: "Chandigarh",
    type: "UT",
    regions: ["Sector 17", "Sukhna Lake", "Rock Garden", "Rose Garden", "Mohali Border"],
    stats: { population: "1.2 Million", capital: "Chandigarh" }
  },
  {
    name: "Dadra & Nagar Haveli and Daman & Diu",
    type: "UT",
    regions: ["Daman", "Diu", "Silvassa", "Nani Daman", "Moti Daman"],
    stats: { population: "0.6 Million", capital: "Daman" }
  },
  {
    name: "Delhi",
    type: "NCT",
    regions: ["New Delhi", "South Delhi", "Connaught Place", "Chandni Chowk", "Dwarka"],
    stats: { population: "32 Million", capital: "New Delhi" }
  },
  {
    name: "Jammu and Kashmir",
    type: "UT",
    regions: ["Srinagar", "Jammu", "Gulmarg", "Pahalgam", "Sonamarg"],
    stats: { population: "13 Million", capital: "Srinagar (Summer)" }
  },
  {
    name: "Ladakh",
    type: "UT",
    regions: ["Leh", "Kargil", "Nubra Valley", "Pangong Tso", "Zanskar"],
    stats: { population: "0.3 Million", capital: "Leh" }
  },
  {
    name: "Lakshadweep",
    type: "UT",
    regions: ["Kavaratti", "Agatti", "Minicoy", "Bangaram", "Kalpeni"],
    stats: { population: "0.06 Million", capital: "Kavaratti" }
  },
  {
    name: "Puducherry",
    type: "UT",
    regions: ["Pondicherry", "Auroville", "Karaikal", "Mahe", "Yanam"],
    stats: { population: "1.4 Million", capital: "Puducherry" }
  }
];

import { TrendingUp, Users, Landmark, Award, Zap, BookOpen, Anchor, Smile } from 'lucide-react';

// Default Safety Object (Common across most of India)
const DEFAULT_SAFETY = {
  police: "112",
  ambulance: "108",
  touristHelpline: "1363" // MoT Toll-free
};

// --- Detailed Stats for All 36 Entities ---
export const STATE_STATS_DATA = {
  // --- STATES ---
  "Andhra Pradesh": {
    achievements: [
      { label: "GSDP Contribution", value: "$150B+", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Annual Tourists", value: "120M+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Coastline", value: "974 km", icon: Anchor, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Ease of Business", value: "Top Tier", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Hyderabadi Biryani", type: "Non-Veg", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200" },
      { name: "Pesarattu", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Gongura Pachadi", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" }
    ],
    transport: {
      airport: "Visakhapatnam Intl (VTZ)",
      rail: "South Coast Railway Zone",
      road: "NH-16 Connectivity"
    },
    safety: DEFAULT_SAFETY
  },
  "Arunachal Pradesh": {
    achievements: [
      { label: "Forest Cover", value: "79%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Biodiversity", value: "High", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Monasteries", value: "Key Sites", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Cleanliness", value: "Pure Air", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Thukpa", type: "Non-Veg", img: "https://images.unsplash.com/photo-1625223000782-2c672b152d11?q=80&w=200" },
      { name: "Bamboo Shoot", type: "Veg", img: "https://images.unsplash.com/photo-1615486511262-c7b5c7f42974?q=80&w=200" },
      { name: "Pika Pila", type: "Veg", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=200" }
    ],
    transport: {
      airport: "Donyi Polo Airport (HGI)",
      rail: "Naharlagun Station",
      road: "Trans-Arunachal Highway"
    },
    safety: DEFAULT_SAFETY
  },
  "Assam": {
    achievements: [
      { label: "Tea Production", value: "50% of India", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Wildlife", value: "Rhino Hub", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "02", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "River Island", value: "Majuli", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Masor Tenga", type: "Non-Veg", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=200" },
      { name: "Khar", type: "Veg", img: "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=200" },
      { name: "Pitha", type: "Veg", img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=200" }
    ],
    transport: {
      airport: "Lokpriya Gopinath Bordoloi (GAU)",
      rail: "Northeast Frontier HQ",
      road: "NH-27 Corridor"
    },
    safety: DEFAULT_SAFETY
  },
  "Bihar": {
    achievements: [
      { label: "GDP Growth", value: "10.6%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Heritage", value: "Ancient", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Workforce", value: "Young", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Spirituality", value: "Buddhism", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Litti Chokha", type: "Veg", img: "https://images.unsplash.com/photo-1633383718081-22ac93e3db65?q=80&w=200" },
      { name: "Sattu Paratha", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Khaja", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Jayprakash Narayan Intl (PAT)",
      rail: "East Central Railway HQ",
      road: "Grand Trunk Road"
    },
    safety: DEFAULT_SAFETY
  },
  "Chhattisgarh": {
    achievements: [
      { label: "Power Hub", value: "Zero Cuts", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Minerals", value: "Rich", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Waterfalls", value: "Niagara of India", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Steel", value: "Major Hub", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Chila", type: "Veg", img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=200" },
      { name: "Fara", type: "Veg", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=200" },
      { name: "Muthia", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" }
    ],
    transport: {
      airport: "Swami Vivekananda (RPR)",
      rail: "South East Central HQ",
      road: "NH-53"
    },
    safety: DEFAULT_SAFETY
  },
  "Goa": {
    achievements: [
      { label: "Tourism GDP", value: "High", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Annual Tourists", value: "8M+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "Churches", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Quality of Life", value: "Rank #1", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Goan Fish Curry", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Bebinca", type: "Veg", img: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?q=80&w=200" },
      { name: "Prawn Balchao", type: "Non-Veg", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=200" }
    ],
    transport: {
      airport: "Dabolim & Mopa (GOI/GOX)",
      rail: "Konkan Railway",
      road: "NH-66 Coastal"
    },
    safety: DEFAULT_SAFETY
  },
  "Gujarat": {
    achievements: [
      { label: "Exports", value: "Top State", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Industry", value: "Diamond Hub", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "04", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Coastline", value: "1600km", icon: Anchor, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dhokla", type: "Veg", img: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?q=80&w=200" },
      { name: "Thepla", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Undhiyu", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Sardar Vallabhbhai Patel (AMD)",
      rail: "Western Railway HQ",
      road: "Vadodara-Mumbai Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Haryana": {
    achievements: [
      { label: "Auto Hub", value: "50% Cars", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Sports", value: "Medal Factory", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Agriculture", value: "Grain Bowl", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "IT Hub", value: "Gurugram", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Bajra Khichdi", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Kadhi Pakora", type: "Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Churma", type: "Veg", img: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=200" }
    ],
    transport: {
      airport: "IGI Delhi (Proximity)",
      rail: "Northern Railway Hub",
      road: "KMP Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Himachal Pradesh": {
    achievements: [
      { label: "Hydro Power", value: "Surplus", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Tourism", value: "17M+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Fruit Bowl", value: "Apples", icon: Smile, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Literacy", value: "82%+", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dham", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Siddu", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Babru", type: "Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" }
    ],
    transport: {
      airport: "Bhuntar/Shimla (KUU)",
      rail: "Kalka-Shimla Toy Train",
      road: "Manali-Leh Highway"
    },
    safety: DEFAULT_SAFETY
  },
  "Jharkhand": {
    achievements: [
      { label: "Mineral Wealth", value: "40% of India", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Steel City", value: "Jamshedpur", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Forests", value: "29%", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Waterfalls", value: "Multiple", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dhuska", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Handia", type: "Veg", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200" },
      { name: "Bamboo Shoot", type: "Veg", img: "https://images.unsplash.com/photo-1615486511262-c7b5c7f42974?q=80&w=200" }
    ],
    transport: {
      airport: "Birsa Munda (IXR)",
      rail: "Ranchi Division",
      road: "NH-33"
    },
    safety: DEFAULT_SAFETY
  },
  "Karnataka": {
    achievements: [
      { label: "Tech Hub", value: "Silicon Valley", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Exports", value: "#1 Software", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "Hampi/W.Ghats", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Startups", value: "10K+", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Mysore Pak", type: "Veg", img: "https://images.unsplash.com/photo-1605197584547-c93aa146d0fa?q=80&w=200" },
      { name: "Bisi Bele Bath", type: "Veg", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200" },
      { name: "Neer Dosa", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" }
    ],
    transport: {
      airport: "Kempegowda Intl (BLR)",
      rail: "South Western Railway HQ",
      road: "NH-48"
    },
    safety: DEFAULT_SAFETY
  },
  "Kerala": {
    achievements: [
      { label: "Literacy", value: "96.2%", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "HDI", value: "Rank #1", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Tourism", value: "Global Brand", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Health", value: "Top Tier", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Appam with Stew", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Karimeen Fry", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Puttu and Kadala", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Cochin Intl (COK)",
      rail: "Southern Railway Div",
      road: "NH-66"
    },
    safety: DEFAULT_SAFETY
  },
  "Madhya Pradesh": {
    achievements: [
      { label: "Agriculture", value: "20% Growth", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Clean City", value: "Indore #1", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Tigers", value: "Highest Pop", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "UNESCO Sites", value: "03", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Poha Jalebi", type: "Veg", img: "https://images.unsplash.com/photo-1595642527925-4d41cb781653?q=80&w=200" },
      { name: "Dal Bafla", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Bhutte Ka Kees", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Devi Ahilya Bai (IDR)",
      rail: "West Central Railway HQ",
      road: "North-South Corridor"
    },
    safety: DEFAULT_SAFETY
  },
  "Maharashtra": {
    achievements: [
      { label: "GSDP", value: "$400B+ (#1)", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Industry", value: "Manufacturing", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Bollywood", value: "Film Hub", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "UNESCO Sites", value: "06", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Vada Pav", type: "Veg", img: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?q=80&w=200" },
      { name: "Misal Pav", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=200" },
      { name: "Puran Poli", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "CSM Intl Mumbai (BOM)",
      rail: "Central & Western HQ",
      road: "Mumbai-Pune Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Manipur": {
    achievements: [
      { label: "Sports", value: "Powerhouse", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Culture", value: "Dance", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Ecology", value: "Loktak Lake", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Handloom", value: "Rich", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Eromba", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Kangshoi", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Chahao Kheer", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Bir Tikendrajit (IMF)",
      rail: "Jiribam Link",
      road: "Asian Highway 1"
    },
    safety: DEFAULT_SAFETY
  },
  "Meghalaya": {
    achievements: [
      { label: "Rainfall", value: "Highest", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Music", value: "Rock Capital", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Nature", value: "Living Bridges", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Cleanliness", value: "Mawlynnong", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Jadoh", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Doh Khleh", type: "Non-Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Bamboo Shoot", type: "Veg", img: "https://images.unsplash.com/photo-1615486511262-c7b5c7f42974?q=80&w=200" }
    ],
    transport: {
      airport: "Umroi Airport (SHL)",
      rail: "Mendipathar Station",
      road: "NH-6"
    },
    safety: DEFAULT_SAFETY
  },
  "Mizoram": {
    achievements: [
      { label: "Literacy", value: "91.3%", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Forests", value: "88% Area", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Culture", value: "Bamboo Dance", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Peace", value: "High", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Bai", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Vawksa Rep", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Koat Pitha", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Lengpui Airport (AJL)",
      rail: "Bairabi Station",
      road: "NH-54"
    },
    safety: DEFAULT_SAFETY
  },
  "Nagaland": {
    achievements: [
      { label: "Festivals", value: "Hornbill", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Culture", value: "Tribal", icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Biodiversity", value: "Rich", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Handicraft", value: "Expert", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Smoked Pork", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Bamboo Fish", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Axone", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" }
    ],
    transport: {
      airport: "Dimapur Airport (DMU)",
      rail: "Dimapur Station",
      road: "NH-29"
    },
    safety: DEFAULT_SAFETY
  },
  "Odisha": {
    achievements: [
      { label: "Minerals", value: "Iron Ore", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Sports", value: "Hockey Hub", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "Sun Temple", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Disaster Mgmt", value: "Model State", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dalma", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Pakhala Bhata", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Chhena Poda", type: "Veg", img: "https://images.unsplash.com/photo-1605197584547-c93aa146d0fa?q=80&w=200" }
    ],
    transport: {
      airport: "Biju Patnaik Intl (BBI)",
      rail: "East Coast Railway HQ",
      road: "Biju Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Punjab": {
    achievements: [
      { label: "Agriculture", value: "Food Bowl", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Entrepreneurship", value: "High", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Spirituality", value: "Golden Temple", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Sports", value: "Active", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Butter Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" },
      { name: "Makki Roti Saag", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Lassi", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" }
    ],
    transport: {
      airport: "Amritsar Intl (ATQ)",
      rail: "Firozpur Division",
      road: "Grand Trunk Road"
    },
    safety: DEFAULT_SAFETY
  },
  "Rajasthan": {
    achievements: [
      { label: "Tourism", value: "50M+", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Solar Power", value: "#1 Capacity", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "09", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Heritage", value: "Royalty", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dal Baati Churma", type: "Veg", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200" },
      { name: "Gatte ki Sabzi", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Laal Maas", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" }
    ],
    transport: {
      airport: "Jaipur Intl (JAI)",
      rail: "North Western Railway HQ",
      road: "Delhi-Mumbai Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Sikkim": {
    achievements: [
      { label: "Organic", value: "100% State", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Environment", value: "Cleanest", icon: Smile, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Peak", value: "Kanchenjunga", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "GDP Growth", value: "Fastest", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Momo", type: "Veg", img: "https://images.unsplash.com/photo-1625223000782-2c672b152d11?q=80&w=200" },
      { name: "Thukpa", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Phagshapa", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" }
    ],
    transport: {
      airport: "Pakyong Airport (PYG)",
      rail: "Rangpo (Upcoming)",
      road: "NH-10"
    },
    safety: DEFAULT_SAFETY
  },
  "Tamil Nadu": {
    achievements: [
      { label: "GSDP", value: "$300B+", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Industrial", value: "Factory Hub", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Temples", value: "33,000+", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Urbanization", value: "48%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Dosa", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Idli Sambar", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Chettinad Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" }
    ],
    transport: {
      airport: "Chennai Intl (MAA)",
      rail: "Southern Railway HQ",
      road: "East Coast Road"
    },
    safety: DEFAULT_SAFETY
  },
  "Telangana": {
    achievements: [
      { label: "IT Exports", value: "Major Hub", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Pharma", value: "Vaccine Capital", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Heritage", value: "Nizam Era", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Ease of Living", value: "High", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Hyderabadi Biryani", type: "Non-Veg", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200" },
      { name: "Haleem", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Qubani Ka Meetha", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Rajiv Gandhi Intl (HYD)",
      rail: "South Central HQ",
      road: "ORR Hyderabad"
    },
    safety: DEFAULT_SAFETY
  },
  "Tripura": {
    achievements: [
      { label: "Literacy", value: "87.2%", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Rubber", value: "2nd Largest", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Culture", value: "Royal", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Eco-Tourism", value: "Growing", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Mui Borok", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Kosoi Bwtwi", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Gudok", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: {
      airport: "Maharaja Bir Bikram (IXA)",
      rail: "Agartala Station",
      road: "NH-8"
    },
    safety: DEFAULT_SAFETY
  },
  "Uttar Pradesh": {
    achievements: [
      { label: "GSDP", value: "$250B+", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Tourists", value: "318M+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "03", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Expressways", value: "13+", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Galouti Kebab", type: "Non-Veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200" },
      { name: "Petha", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Bedmi Puri", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=200" }
    ],
    transport: {
      airport: "LKO/Varanasi (LKO)",
      rail: "North Central Railway Hub",
      road: "Yamuna Expressway"
    },
    safety: DEFAULT_SAFETY
  },
  "Uttarakhand": {
    achievements: [
      { label: "Tourism", value: "Pilgrimage", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Yoga", value: "World Capital", icon: Smile, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Forests", value: "45%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Education", value: "Hub", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Kafuli", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Bhang Ki Chutney", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" },
      { name: "Aloo Ke Gutke", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" }
    ],
    transport: {
      airport: "Jolly Grant (DED)",
      rail: "Dehradun Terminal",
      road: "Char Dham Highway"
    },
    safety: DEFAULT_SAFETY
  },
  "West Bengal": {
    achievements: [
      { label: "GSDP", value: "Major Econ", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Culture", value: "Intellectual", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UNESCO Sites", value: "02", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "MSMEs", value: "High Count", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Rosogolla", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Machher Jhol", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Mishti Doi", type: "Veg", img: "https://images.unsplash.com/photo-1605197584547-c93aa146d0fa?q=80&w=200" }
    ],
    transport: {
      airport: "Netaji Subhash (CCU)",
      rail: "Eastern/SE HQ",
      road: "NH-19"
    },
    safety: DEFAULT_SAFETY
  },

  // --- UNION TERRITORIES ---
  "Andaman and Nicobar Islands": {
    achievements: [
      { label: "Tourism", value: "Beaches", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Strategic", value: "Defence", icon: Anchor, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Forests", value: "86%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "History", value: "Cellular Jail", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Seafood", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Coconut Curry", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Grilled Fish", type: "Non-Veg", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=200" }
    ],
    transport: { airport: "Veer Savarkar (IXZ)", rail: "None", road: "Grand Andaman Trunk" },
    safety: DEFAULT_SAFETY
  },
  "Chandigarh": {
    achievements: [
      { label: "Urban Planning", value: "World Class", icon: Landmark, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Cleanliness", value: "Top Tier", icon: Smile, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "HDI", value: "Very High", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Green Cover", value: "High", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Chole Bhature", type: "Veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=200" },
      { name: "Butter Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" },
      { name: "Lassi", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" }
    ],
    transport: { airport: "Shaheed Bhagat Singh (IXC)", rail: "Chandigarh Junction", road: "NH-5" },
    safety: DEFAULT_SAFETY
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    achievements: [
      { label: "Industry", value: "Plastics", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Tourism", value: "Beaches", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Heritage", value: "Portuguese", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Peace", value: "High", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Seafood", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Ubadiyu", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Dhokla", type: "Veg", img: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?q=80&w=200" }
    ],
    transport: { airport: "Diu Airport (DIU)", rail: "Vapi (Nearby)", road: "NH-48" },
    safety: DEFAULT_SAFETY
  },
  "Delhi": {
    achievements: [
      { label: "GSDP", value: "$100B+", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Capital", value: "Power Center", icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Metro", value: "390km+", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "History", value: "Mughal Era", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Chaat", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Butter Chicken", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" },
      { name: "Parathas", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" }
    ],
    transport: { airport: "IGI Airport (DEL)", rail: "NDLS/Nizamuddin", road: "Multiple Expressways" },
    safety: DEFAULT_SAFETY
  },
  "Jammu and Kashmir": {
    achievements: [
      { label: "Tourism", value: "Paradise", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Saffron", value: "GI Tag", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Handicraft", value: "Pashmina", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Nature", value: "Himalayas", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Roghan Josh", type: "Non-Veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200" },
      { name: "Wazwan", type: "Non-Veg", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=200" },
      { name: "Kahwa", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" }
    ],
    transport: { airport: "Srinagar Intl (SXR)", rail: "USBRL Project", road: "NH-44" },
    safety: DEFAULT_SAFETY
  },
  "Ladakh": {
    achievements: [
      { label: "Tourism", value: "Adventure", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Solar", value: "Potential", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Culture", value: "Buddhist", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Geography", value: "High Desert", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Thukpa", type: "Veg", img: "https://images.unsplash.com/photo-1625223000782-2c672b152d11?q=80&w=200" },
      { name: "Skyu", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" },
      { name: "Butter Tea", type: "Veg", img: "https://images.unsplash.com/photo-1596450523824-6b941076b008?q=80&w=200" }
    ],
    transport: { airport: "Kushok Bakula Rimpochee (IXL)", rail: "Proposed", road: "Khardung La" },
    safety: DEFAULT_SAFETY
  },
  "Lakshadweep": {
    achievements: [
      { label: "Tourism", value: "Coral Reefs", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Literacy", value: "91.8%", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Fisheries", value: "Tuna", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Ecology", value: "Fragile", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Tuna Curry", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Coconut Rice", type: "Veg", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200" },
      { name: "Fried Fish", type: "Non-Veg", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=200" }
    ],
    transport: { airport: "Agatti (AGX)", rail: "None", road: "Island Roads" },
    safety: DEFAULT_SAFETY
  },
  "Puducherry": {
    achievements: [
      { label: "Tourism", value: "French", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Literacy", value: "85%", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Spirituality", value: "Auroville", icon: Landmark, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Lifestyle", value: "Relaxed", icon: Smile, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    food: [
      { name: "Crepes", type: "Veg", img: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?q=80&w=200" },
      { name: "Seafood", type: "Non-Veg", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
      { name: "Baguette", type: "Veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=200" }
    ],
    transport: { airport: "Puducherry (PNY)", rail: "Puducherry Station", road: "ECR" },
    safety: DEFAULT_SAFETY
  },
};

/**
 * Retrieves detailed stats for a state with fuzzy matching.
 */
export const getStateStats = (stateName) => {
  if (!stateName) return null;
  // Direct match
  if (STATE_STATS_DATA[stateName]) return STATE_STATS_DATA[stateName];
  // Fuzzy match
  const key = Object.keys(STATE_STATS_DATA).find(k => 
    k.toLowerCase().includes(stateName.toLowerCase()) || 
    stateName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? STATE_STATS_DATA[key] : null;
};