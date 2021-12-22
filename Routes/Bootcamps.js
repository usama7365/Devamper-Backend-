const express = require("express")
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp,getBootcampsInRadius,bootcampPhotoUpload} = require("../controllers/bootcamp")
const {protect, authorize}=require('../middleware/auth')
const Bootcamp = require('../model/bootcamp')
const advancedresult = require('../middleware/advancedresult')
const courseRoute = require('./course')



// destructuring getBootcampsInRadius in Controller/Bootcamp
const router = express.Router()
const reviewRouter = require('./reviews');
router.use('/:bootcampId/reviews', reviewRouter);



router.use('/:bootcampId/courses',courseRoute)

router.route('/')
    .get(advancedresult(Bootcamp , "Courses") , getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)    

    
router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'),updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'),deleteBootcamp)

    router.route('/:id/photo').put(protect, authorize('publisher', 'admin'),bootcampPhotoUpload)
    
    router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);



module.exports = router