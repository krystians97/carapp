import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

export interface CarDTO {
    id: string
    brand: string
    model: string
    rented: boolean
    photo: string
    description: string
}

export default {
    method: 'get',
    path: '/api/cars/available',
    validators: [authorize],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            messages: { uniqueConstraintFailed: 'Email must be unique.' },
            execute: async () => {
                const cars = await prisma.car.findMany({
                    where: { renterId: null },
                })
                const carsDTOs = cars.map((car) => {
                    const carDTO: CarDTO = {
                        id: car.id,
                        brand: car.brand,
                        model: car.model,
                        photo: car.photo ?? 'brak zdjęcia',
                        description: car.description ?? 'brak opisu',
                        rented: false,
                    }
                    return carDTO
                })
                return carsDTOs
            },
        }),
} as TRoute
