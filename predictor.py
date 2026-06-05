import pandas as pd
import numpy as np
import pickle

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score


rows = 1000


data = pd.DataFrame({

    "AvgMarks":
    np.random.randint(
        40,
        100,
        rows
    ),

    "StudyHours":
    np.random.randint(
        1,
        15,
        rows
    ),

    "Attendance":
    np.random.randint(
        50,
        100,
        rows
    ),

    "PreviousMarks":
    np.random.randint(
        40,
        100,
        rows
    ),

    "Assignments":
    np.random.randint(
        1,
        20,
        rows
    )

})


data["FinalScore"] = (

    data["AvgMarks"] * 0.30 +

    data["StudyHours"] * 2 +

    data["Attendance"] * 0.20 +

    data["PreviousMarks"] * 0.30 +

    data["Assignments"] * 1.5 +

    np.random.randint(
        -5,
        5,
        rows
    )

)


X = data[[

    "AvgMarks",

    "StudyHours",

    "Attendance",

    "PreviousMarks",

    "Assignments"

]]


y = data[
    "FinalScore"
]


x_train,x_test,y_train,y_test = train_test_split(

    X,

    y,

    test_size=0.2,

    random_state=42

)


model = RandomForestRegressor(

    n_estimators=200,

    random_state=42

)


model.fit(

    x_train,

    y_train

)


pred = model.predict(
    x_test
)


accuracy = r2_score(

    y_test,

    pred

)


pickle.dump(

    model,

    open(
        "student_model.pkl",
        "wb"
    )

)


with open(

    "accuracy.txt",

    "w"

) as f:

    f.write(

        str(

            round(
                accuracy*100,
                2
            )

        )

    )


print(
    "Model trained successfully"
)

print(

    "Accuracy:",

    round(
        accuracy*100,
        2
    ),

    "%"

)