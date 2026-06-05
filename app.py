from flask import Flask, request, send_from_directory
import pickle
import pandas as pd
import json

app = Flask(__name__)

model = pickle.load(
    open(
        "student_model.pkl",
        "rb"
    )
)

@app.route("/")
def home():

    return send_from_directory(
        ".",
        "index.html"
    )


@app.route("/<path:path>")
def files(path):

    return send_from_directory(
        ".",
        path
    )


@app.route("/predict")
def predict():

    try:

        study = float(
            request.args.get(
                "study"
            )
        )

        attendance = float(
            request.args.get(
                "attendance"
            )
        )

        previous = float(
            request.args.get(
                "previous"
            )
        )

        assignment = float(
            request.args.get(
                "assignment"
            )
        )

        subjects = json.loads(
            request.args.get(
                "subjects"
            )
        )

        avg_marks = 0

        if len(subjects) > 0:

            avg_marks = sum(
                subjects.values()
            ) / len(
                subjects
            )

        data = pd.DataFrame([{

            "AvgMarks": avg_marks,

            "StudyHours": study,

            "Attendance": attendance,

            "PreviousMarks": previous,

            "Assignments": assignment

        }])

        result = model.predict(
            data
        )

        return str(
            round(
                result[0],
                2
            )
        )

    except Exception as e:

        return str(e)


app.run(
    debug=True
)