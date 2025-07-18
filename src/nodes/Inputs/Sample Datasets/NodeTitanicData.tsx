import { createNodeComponent } from "../../createNodeComponent";
import * as dfd from "danfojs";

const titanicSample = [{
            "Pclass": 3,
            "Sex": "male",
            "Age": 34.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8292,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 47,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 7,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 62,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.6875,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 12.2875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 14,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.225,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.6292,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 26,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 29,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 24.15,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 46,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 23,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 82.2667,
            "Cabin": "B45",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 63,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 47,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 61.175,
            "Cabin": "E31",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 24,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 35,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 12.35,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 27,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 7.925,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 45,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 55,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 59.4,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 9,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 3.1708,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 31.6833,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 61.3792,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 48,
            "SibSp": 1,
            "Parch": 3,
            "Fare": 262.375,
            "Cabin": "B57 B59 B63 B66",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 50,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 61.9792,
            "Cabin": "B36",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 22.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 41,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 30.5,
            "Cabin": "A21",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 21.6792,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 50,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 24,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 31.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 33,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 20.575,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 23.45,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 30,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 57.75,
            "Cabin": "C78",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 18.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 56.4958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 39,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 13.4167,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "D34",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 41,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.85,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 45,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 52.5542,
            "Cabin": "D19",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.925,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 45,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 29.7,
            "Cabin": "A9",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 60,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 76.2917,
            "Cabin": "D15",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 36,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 15.9,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 24,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 60,
            "Cabin": "C31",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.0333,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 20,
            "SibSp": 2,
            "Parch": 1,
            "Fare": 23,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 28,
            "SibSp": 3,
            "Parch": 2,
            "Fare": 263,
            "Cabin": "C23 C25 C27",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.5792,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 10,
            "SibSp": 4,
            "Parch": 1,
            "Fare": 29.125,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 35,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.65,
            "Cabin": "F G63",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 16.1,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 262.375,
            "Cabin": "B61",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 17,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.725,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 13,
            "SibSp": 2,
            "Parch": 2,
            "Fare": 262.375,
            "Cabin": "B57 B59 B63 B66",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 47,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 42.4,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 31,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 28.5375,
            "Cabin": "C53",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 60,
            "SibSp": 1,
            "Parch": 4,
            "Fare": 263,
            "Cabin": "C23 C25 C27",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 29,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.925,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 28.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "D43",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 35,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 211.5,
            "Cabin": "C130",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 32.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 211.5,
            "Cabin": "C132",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 55,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 25.7,
            "Cabin": "C101",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 6,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 15.2458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 67,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 221.7792,
            "Cabin": "C55 C57",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 49,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.7083,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.4542,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 2,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 23,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 13.9,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 27,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 52,
            "Cabin": "B71",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 76,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 78.85,
            "Cabin": "C46",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 29,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.925,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 33,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 43,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 55.4417,
            "Cabin": "C116",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 27,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 16,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 8.5167,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 22.525,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8208,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.7125,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 18.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "F",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 41,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.0458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 31.6792,
            "Cabin": "A29",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 18.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2833,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 63,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 221.7792,
            "Cabin": "C55 C57",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 18,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.4542,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 6.4375,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 1,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 16.7,
            "Cabin": "G6",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 75.2417,
            "Cabin": "C6",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 29,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 12,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.75,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 35,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 57.75,
            "Cabin": "C28",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.25,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 17,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 16.1,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 23.25,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 42,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 53,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 28.5,
            "Cabin": "C51",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 4,
            "Fare": 25.4667,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 6.4375,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 43,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 26.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 40,
            "SibSp": 1,
            "Parch": 6,
            "Fare": 46.9,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 10,
            "SibSp": 5,
            "Parch": 2,
            "Fare": 46.9,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 33,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 151.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 61,
            "SibSp": 1,
            "Parch": 3,
            "Fare": 262.375,
            "Cabin": "B57 B59 B63 B66",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 42,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 31,
            "SibSp": 3,
            "Parch": 0,
            "Fare": 18,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 51.8625,
            "Cabin": "E46",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 30,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 23,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 83.1583,
            "Cabin": "C54",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 60.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": null,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 36,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 12.1833,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 13,
            "SibSp": 4,
            "Parch": 2,
            "Fare": 31.3875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 29,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 221.7792,
            "Cabin": "C97",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 42,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "D22",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 26,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 13.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7333,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 7,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 15.2458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 41,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 26,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 22.025,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 48,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 50.4958,
            "Cabin": "B10",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 18,
            "SibSp": 2,
            "Parch": 2,
            "Fare": 34.375,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.9625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 23,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 13.9,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 40,
            "SibSp": 1,
            "Parch": 5,
            "Fare": 31.3875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 15,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 39,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 36.75,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 54,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 55.4417,
            "Cabin": "C116",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 36,
            "SibSp": 0,
            "Parch": 3,
            "Fare": 39,
            "Cabin": "F4",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 64,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 83.1583,
            "Cabin": "E45",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 37,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 83.1583,
            "Cabin": "E52",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 18,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 53.1,
            "Cabin": "D30",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 27,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 247.5208,
            "Cabin": "B58 B60",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 40,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 16,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 21,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 17,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 8,
            "Parch": 2,
            "Fare": 69.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 40,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 34,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 11.5,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 14.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 61,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 12.35,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 8,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 32.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 33,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 6,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 134.5,
            "Cabin": "E34",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.1125,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.5,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 0.33,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 14.4,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 47,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 227.525,
            "Cabin": "C62 C64",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 8,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 25.7417,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 35,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 33,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "A11",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 22.525,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 17,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 73.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 60,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 38,
            "SibSp": 4,
            "Parch": 2,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 42,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 42.5,
            "Cabin": "B11",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 57,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 164.8667,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 50,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 211.5,
            "Cabin": "C80",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 30,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 13.8583,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "F33",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 53,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 27.4458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 15.2458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 40.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.1,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 14,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 65,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 6.4958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 39,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 71.2833,
            "Cabin": "C85",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 64,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 75.25,
            "Cabin": "D37",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 18,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 48,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 106.425,
            "Cabin": "C86",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 55,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 45,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 30,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 45,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 134.5,
            "Cabin": "E34",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 23.45,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 41,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 51.8625,
            "Cabin": "D21",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 42,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 32.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 29,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.4542,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 0.92,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 27.75,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.925,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 27,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 136.7792,
            "Cabin": "C89",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.325,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 32.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 19,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 36.5,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 17.4,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 29,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 23,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 1,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 12.1833,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 12.7375,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 0,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 17,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 46,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 75.2417,
            "Cabin": "C6",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 26,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 136.7792,
            "Cabin": "C89",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 15.5,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 20,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 40,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 30,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 0.75,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 13.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 9,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 15.2458,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 2,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 20.2125,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.25,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.25,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 24,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 82.2667,
            "Cabin": "B45",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "F E46",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 39.6,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 6.95,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 53,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 81.8583,
            "Cabin": "A34",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 36,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 9.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 1,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 41.5792,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 21.6792,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 45.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 29,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 15.0458,
            "Cabin": "D",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 43,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 64,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 26.55,
            "Cabin": "B26",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 30,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 151.55,
            "Cabin": "C22 C26",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 0.83,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 9.35,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 55,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 93.5,
            "Cabin": "B69",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 45,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.1083,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.575,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 37,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 55,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 135.6333,
            "Cabin": "C32",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 17,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7333,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 57,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 146.5208,
            "Cabin": "B78",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 19,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8542,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 22,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 31.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "F E57",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "F2",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 33,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 39,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 211.3375,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 12,
            "SibSp": 2,
            "Parch": 1,
            "Fare": 39,
            "Cabin": "F4",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 46,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 79.2,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 29,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 48,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 36.75,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 39,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 29.7,
            "Cabin": "A18",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.225,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 19,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 15.7417,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8958,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "C106",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 39,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 31.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 32,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.5792,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 9,
            "Fare": 69.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 58,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 512.3292,
            "Cabin": "B51 B53 B55",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 14.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 16,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.65,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 38,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.2292,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 31,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 45,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 63.3583,
            "Cabin": "D10 D12",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 25,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 18,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 73.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 49,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 65,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 0.17,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 20.575,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 50,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 26,
            "Cabin": "E60",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 59,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 51.4792,
            "Cabin": "C101",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 30,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 15.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 14.5,
            "SibSp": 8,
            "Parch": 2,
            "Fare": 69.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 24,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 37.0042,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 31,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 27,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 25,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 55.4417,
            "Cabin": "E50",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 1,
            "Parch": 9,
            "Fare": 69.55,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 14.4583,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 39.6875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 45,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 59.4,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 29,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13.8583,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 21,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 11.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 31,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 134.5,
            "Cabin": "E39 E41",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 49,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 0,
            "Cabin": "B52 B54 B56",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 44,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 54,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 81.8583,
            "Cabin": "A34",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 45,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 262.375,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 22,
            "SibSp": 2,
            "Parch": 0,
            "Fare": 8.6625,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 11.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 55,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 50,
            "Cabin": "C39",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 5,
            "SibSp": 4,
            "Parch": 2,
            "Fare": 31.3875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 26,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.8792,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 14.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 19,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 16.1,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 12.875,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "female",
            "Age": 24,
            "SibSp": 1,
            "Parch": 2,
            "Fare": 65,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 57,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 21,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 6,
            "SibSp": 3,
            "Parch": 1,
            "Fare": 21.075,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 23,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 93.5,
            "Cabin": "B24",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 51,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 39.4,
            "Cabin": "D28",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 13,
            "SibSp": 0,
            "Parch": 2,
            "Fare": 20.25,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 47,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 29,
            "SibSp": 3,
            "Parch": 1,
            "Fare": 22.025,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 18,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 60,
            "Cabin": "C31",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 24,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.25,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 48,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 79.2,
            "Cabin": "B41",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 22,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 31,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7333,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 30,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 164.8667,
            "Cabin": "C7",
            "Embarked": "S"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 38,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 21,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 22,
            "SibSp": 0,
            "Parch": 1,
            "Fare": 59.4,
            "Cabin": "",
            "Embarked": "C"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 17,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 47.1,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 43,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 27.7208,
            "Cabin": "D40",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 20,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 13.8625,
            "Cabin": "D38",
            "Embarked": "C"
        },
        {
            "Pclass": 2,
            "Sex": "male",
            "Age": 23,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 10.5,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "male",
            "Age": 50,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 211.5,
            "Cabin": "C80",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.7208,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 3,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 13.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.75,
            "Cabin": "",
            "Embarked": "Q"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 37,
            "SibSp": 1,
            "Parch": 0,
            "Fare": 90,
            "Cabin": "C78",
            "Embarked": "Q"
        },
        {
            "Pclass": 3,
            "Sex": "female",
            "Age": 28,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.775,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 1,
            "Sex": "female",
            "Age": 39,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 108.9,
            "Cabin": "C105",
            "Embarked": "C"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": 38.5,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 7.25,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 0,
            "Parch": 0,
            "Fare": 8.05,
            "Cabin": "",
            "Embarked": "S"
        },
        {
            "Pclass": 3,
            "Sex": "male",
            "Age": null,
            "SibSp": 1,
            "Parch": 1,
            "Fare": 22.3583,
            "Cabin": "",
            "Embarked": "C"
        }
    ]

const NodeTitanicData = createNodeComponent({
  label: "Titanic Dataset",
  description: "Outputs a sample of Titanic passenger data as a DataFrame.",
  width: 260,
  initialInputs: [],
  outputType: "dataframe",
  initialState: {},

  computeOutput: () => new dfd.DataFrame(titanicSample),

  renderInputControls: () => null,

  renderControls: () => (
    <div className="text-xs text-white font-mono bg-black bg-opacity-30 rounded p-2">
      5 rows × {Object.keys(titanicSample).length} columns
    </div>
  ),

  renderOutput: (value) =>
    value instanceof dfd.DataFrame ? (
      <div className="text-white text-xs font-mono pt-1">
        Output: DataFrame [{value.shape[0]}×{value.shape[1]}]
      </div>
    ) : null,
});

export default NodeTitanicData;
