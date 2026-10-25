import Brand from '../models/Brand.js';

const createBrand = async (req, res, next) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            brand,
        })
    } catch (error) {
        next(error);
    }
}

const getBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            count: brands.length,
            brands
        })
    } catch (error) {
        next(error);
    }
}

const getBrandById = async (req, res, next) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not Found"
            })
        }
        res.status(200).json({
            success: true,
            brand
        })
    } catch (error) {
        next(error)
    }
}


const updateBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, })
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            brand,
        })
    } catch (error) {
        next(error)
    }
}

const deleteBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            })

        }

        res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
}