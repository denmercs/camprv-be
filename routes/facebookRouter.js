const express = require("express");
const router = express.Router();
const facebookHelper = require("./facebookHelper");
const NodeGeocoder = require("node-geocoder");

let options = {
  provider: "opencage",
  httpAdapter: "https",
  apiKey: process.env.OPENCAGE_GEOCODING_API_KEY,
  formatter: null
};

let geocoder = NodeGeocoder(options);

router.get("/albums/", async (req, res) => {
  try {
    let fbDatas = await facebookHelper.getAlbums();
    let withGeoCodes = [];

    for (let i = 0; i < fbDatas.length; i++) {
      if (fbDatas[i].location !== undefined) {
        let geocodes = await geocoder.geocode(fbDatas[i].location);
        withGeoCodes.push({
          id: fbDatas[i].id,
          name: fbDatas[i].name,
          desription: fbDatas[i].description,
          coverPhoto: fbDatas[i].cover_photo.id,
          latitude: geocodes[0].latitude,
          longitude: geocodes[0].longitude
        });
      }
    }
    console.log(withGeoCodes);
    res.status(200).json(withGeoCodes);
  } catch (err) {
    console.log(err);
  }
});

router.post("/geocodes/", async (req, res) => {
  try {
    let { location } = req.body;

    let geocodeUpdate = await geocoder.geocode(location);

    res.status(200).json(geocodeUpdate[0]);
  } catch (err) {
    console.log(err);
  }
});

router.post("/album/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let fbAlbumData = await facebookHelper.getAlbumData(id);

    res.status(200).json(fbAlbumData);
  } catch (err) {
    console.log(err);
  }
});

router.post("/coverphoto/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let coverPhoto = await facebookHelper.getCoverPhoto(id);
    res.status(200).json(coverPhoto);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
