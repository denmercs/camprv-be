const express = require("express");
const router = express.Router();
const facebookHelper = require("../helper/facebookHelper");
const geocode = require("../helper/geocode");
const cors = require("cors");
const { getCoverPhoto } = require("../helper/facebookHelper");

// router.get("/wedding/albums/", async (req, res) => {
//   try {
//     let fbDatas = await facebookHelper.getAlbums();
//     let wedding = [];

//     for (let i = 0; i < fbDatas.length; i++) {
//       if (
//         fbDatas[i].location !== undefined &&
//         fbDatas[i].name.toLowerCase().includes("wedding")
//       ) {
//         let geocodes = await geocode.geosearch(fbDatas[i].location);
//         // let coverPhoto = await facebookHelper.getCoverPhoto(fbDatas[i].id);
//         wedding.push({
//           id: fbDatas[i].id,
//           name: fbDatas[i].name,
//           latitude: geocodes[0].lat,
//           longitude: geocodes[0].lon,
//         });
//       }
//     }
//     res.status(200).json(wedding);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/engagement/albums/", async (req, res) => {
//   try {
//     let fbDatas = await facebookHelper.getAlbums();
//     let wedding = [];

//     for (let i = 0; i < fbDatas.length; i++) {
//       if (
//         fbDatas[i].location !== undefined &&
//         fbDatas[i].name.toLowerCase().includes("engagement")
//       ) {
//         console.log(fbDatas[i].name.toLowerCase());
//         let geocodes = await geocode.geosearch(fbDatas[i].location);
//         let coverPhoto = await facebookHelper.getCoverPhoto(fbDatas[i].id);
//         wedding.push({
//           id: fbDatas[i].id,
//           name: fbDatas[i].name,
//           description: fbDatas[i].description,
//           latitude: geocodes[0].lat,
//           longitude: geocodes[0].lon,
//           coverPhoto: coverPhoto[0].picture,
//         });
//       }
//     }
//     res.status(200).json(wedding);
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post("/album/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let fbAlbumData = await facebookHelper.getAlbumPictures(id);
    let newAlbum = [];

    if (id === "478468956008094") {
      for (let i = 0; i < fbAlbumData.length; i++) {
        // console.log(fbAlbumData[8].images.source);
        newAlbum.push({
          src: fbAlbumData[i].images[0].source,
          thumbnail: fbAlbumData[i].images[6].source,
          thumbnailWidth: fbAlbumData[i].images[6].width,
          thumbnailHeight: fbAlbumData[i].images[6].height,
        });
      }
    } else {
      for (let i = 0; i < fbAlbumData.length; i++) {
        newAlbum.push({
          src: fbAlbumData[i].images[2].source,
          thumbnail: fbAlbumData[i].images[8].source,
          thumbnailWidth: fbAlbumData[i].images[8].width,
          thumbnailHeight: fbAlbumData[i].images[8].height,
        });
      }
    }
    res.status(200).json(newAlbum);
  } catch (err) {
    console.log(err);
  }
});

router.get("/albums/", async (req, res) => {
  try {
    let fbAlbumData = await facebookHelper.getAlbums();

    let newAlbum = [];
    fbAlbumData.map((album) => {
      if (album.name.toLowerCase().includes("engagement")) {
        newAlbum.push(album);
      }

      if (album.name.toLowerCase().includes("wedding")) {
        newAlbum.push(album);
      }
    });

    res.status(200).json(newAlbum);
  } catch (err) {
    console.log(err);
  }
});

router.post("/coverphoto/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let coverPhoto = await facebookHelper.getCoverPhoto(id);
    console.log("this is the cover photo", coverPhoto);
    res.status(200).json(coverPhoto);
  } catch (err) {
    console.log(err);
  }
});

router.get("/weddings", async (req, res) => {
  try {
    let fbDatas = await facebookHelper.getAlbumsWithCoverPhoto();

    let weddingAlbums = fbDatas.filter((wedding) =>
      wedding.name.toLowerCase().includes("wedding")
    );

    res.status(200).json(weddingAlbums);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/engagements", async (req, res) => {
  try {
    let fbDatas = await facebookHelper.getAlbumsWithCoverPhoto();

    let engagementAlbums = fbDatas.filter((engagement) =>
      engagement.name.toLowerCase().includes("engagement")
    );

    res.status(200).json(engagementAlbums);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
