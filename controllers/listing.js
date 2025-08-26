const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
    let list = await Listing.find({});
        res.render("index.ejs", { list });
};

module.exports.index = async (req, res) => {
        
        try{
            let {country,location}=req.query;
            let {category}=req.query;

            let filter={};
            if(category){
                filter.category=category;
            
            }
            if(country){
                filter.$or = [
                    { country: new RegExp(country, "i") },//regexp is a javascript regular expression
                    { location: new RegExp(country, "i") },//i is for search so that it become non case-senstive
                    
                ];
            }
            if(location){
                filter.location=new RegExp(location,"i");
            }
            let list=await Listing.find(filter);
            res.render("index.ejs", { list,category,country});
            
        }catch(err){
            console.log(err);
            let list = await Listing.find({});
            res.render("index.ejs", { list,category});
        }
        
        // let list=await Listing.find({category});
        // res.render("index.ejs", { list,category });
    
    
        
    
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!list) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listing");
    }
    res.render("showroute.ejs", { list });
};

module.exports.new = async (req, res, next) => {
    const location = req.body.listing.location;
    const country = req.body.listing.country;
    const fullQuery = `${location}, ${country}`;
    let geoData;

    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: fullQuery,
                format: "json",
                limit: 1,
                addressdetails: 1,
                extratags: 1,
                namedetails: 1
            },
            headers: {
                'User-Agent': 'majorproject-app'
            }
        });

        const data = response.data[0];

        if (data && data.lat && data.lon) {
            geoData = {
                type: "Point",
                coordinates: [parseFloat(data.lon), parseFloat(data.lat)]
            };

            const englishName =
                data.namedetails?.['name:en'] ||
                data.namedetails?.name ||
                data.display_name ||
                location;

            req.body.listing.location = englishName;
        } else {
            geoData = {
                type: "Point",
                coordinates: [77.2090, 28.6139] // fallback to Delhi
            };
        }
    } catch (err) {
        geoData = {
            type: "Point",
            coordinates: [77.2090, 28.6139]
        };
    }

    const listings = new Listing(req.body.listing);
    
    listings.owner = req.user._id;
    listings.image = { url: req.file.path, filename: req.file.filename };
    listings.geometry = geoData;

    await listings.save();
    req.flash("success", "New Listing added");
    res.redirect("/listing/");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    let originalImage = list.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_300");
    res.render("edit.ejs", { list, originalImage });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (!req.body.listing) {
        req.flash("error", "Invalid form submission.");
        return res.redirect(`/listing/${id}/edit`);
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = { url, filename };
    }

    const location = req.body.listing.location;
    const country = req.body.listing.country;
    const fullQuery = `${location}, ${country}`;

    if (location) {
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: fullQuery,
                    format: "json",
                    limit: 1,
                    addressdetails: 1,
                    namedetails: 1
                },
                headers: {
                    'User-Agent': 'majorproject-app'
                }
            });

            const data = response.data[0];
            if (data && data.lat && data.lon) {
                listings.geometry = {
                    type: "Point",
                    coordinates: [parseFloat(data.lon), parseFloat(data.lat)]
                };

                const englishName =
                    data.namedetails?.['name:en'] ||
                    data.namedetails?.name ||
                    data.display_name ||
                    location;

                listings.location = englishName;
            }
        } catch (err) {
            console.log("Geocoding failed during update");
        }
    }

    await listings.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};
