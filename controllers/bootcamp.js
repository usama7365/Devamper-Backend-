const path = require('path')
const Bootcamp = require('../model/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params

    //Get lat/longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    const radius = distance / 3963;
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})
// @desc    Get single bootcamp
// @Routes  Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {


    const bootcamp = await Bootcamp.findById(req.params.id)
    res.status(200).json({ success: true, data: bootcamp })

    if (!bootcamp) {
        return res.status(400).json({ success: false })
        next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))
    }


})

// @desc    Create new bootcamp
// @Routes  Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    //Add user to req.body
    req.body.user = req.user.id

    //check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
    // if the  user is not an admin , they  can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The  user  with  ID ${req.user.id}  has already published a bootcamp`, 400))
    }
})

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is bootcamp owner***
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this bootcamp`,
                401
            )
        );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @acess   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(400).json({ sucess: false })
    }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this bootcamp`, 401)
        );
    }
    bootcamp.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
})
// @desc    upload photo bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {


    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(400).json({ success: false })
    }

    if (!req.files) {
        return next(new ErrorResponse(`plz upload`, 404))
    }

    const file = req.files.file
    console.log(file);

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`plz upload an image file`, 400))
    }
    if (!file.size > process.env.IMAGE_SIZE) {
        return next(new ErrorResponse(`image size must be less then ${process.env.IMAGE_SIZE} 5 MegaBytes`))
    }

    // create custom filename
    file.name = `photo${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name)

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`problem with file uploa`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            sucess: true,
            data: file.name
        })
    })
})