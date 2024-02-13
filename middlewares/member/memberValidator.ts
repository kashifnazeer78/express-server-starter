import {check, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

import {db} from "../../config/database";

const signUpValidator = [
    check("name")
        .isLength({min: 1})
        .withMessage("Name is required")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name must not contain anything other than alphabet")
        .custom((value, {req}) => {
            switch (true) {
                case value.length === 1:
                    throw new Error("Name must be at least 2 characters long");
                case value.length > 20:
                    throw new Error("Name cannot be more than 20 characters long");
                default:
                    return true;
            }
        })
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            try {
                const user = await db.member.findUnique({
                    where: {
                        email: value,
                    },
                });

                if (user) {
                    throw new Error(
                        "There is already an account associated with this email address"
                    );
                }
            } catch (err) {
                throw err;
            }
        }),
    check("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

const signUpValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res
            .status(400)
            .json({errors: Object.values(mappedErrors).map((error) => error.msg)});
    }
};

export {signUpValidator, signUpValidatorHandler};