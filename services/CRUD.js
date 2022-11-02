import mongoose from "mongoose";

export function add(model, data) {
    return new Promise(async (resolve, reject) => {
        try {
            let new_object = new model(data)
            await new_object.save()
            resolve("new user added")

        } catch (err) {
            reject(err)
        }
    })
}

export function getOne(model, filter) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await model.findOne(filter)
            resolve(result)

        } catch (err) {
            reject(err)
        }
    })
}

export function getList(model, filter, projection={}) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await model.find(filter, projection)

            resolve(result)

        } catch (err) {
            reject(err)
        }
    })
}

export function updateData(model, filter, data) {
    return new Promise(async (resolve, reject) => {
        try{
            let updated = await model.updateOne(filter, data)
            if (updated.matchedCount == 1) {
                resolve("data updated")
            }
        }catch(err){
            reject(err)
        }
    })
}