let history = []

const chart = new Chart(

    document.getElementById(
        "chart"
    ),

    {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Predictions",

                data: [],

                borderWidth: 3,

                tension: 0.4

            }]

        },

        options: {

            responsive: true

        }

    }

)



async function loadHistory() {

    try {

        let response =

            await fetch(
                "/history"
            )

        let data =

            await response.json()

        history = []

        document
            .getElementById(
                "historyList"
            )
            .innerHTML = ""

        chart.data.labels = []

        chart.data.datasets[0].data = []


        data.forEach(

            item => {

                history.push(
                    item.Score
                )

                chart.data.labels.push(
                    history.length
                )

                chart.data.datasets[0]
                    .data.push(
                        item.Score
                    )

                let li =

                    document.createElement(
                        "li"
                    )

                li.innerText =

                    "Score : "

                    +

                    item.Score

                document
                    .getElementById(
                        "historyList"
                    )
                    .prepend(
                        li
                    )

            }

        )

        chart.update()

        document
            .getElementById(
                "totalPredictions"
            )
            .innerText =

            history.length


        if (history.length > 0) {

            document
                .getElementById(
                    "averagePrediction"
                )
                .innerText =

                (

                    history.reduce(
                        (a, b) => a + b,
                        0
                    )

                    /

                    history.length

                ).toFixed(2)

        }

    }
    catch {

        console.log(
            "History load failed"
        )

    }

}


loadHistory()



document
    .getElementById(
        "addBtn"
    )
    .onclick =

    function () {

        document
            .getElementById(
                "subjects"
            )
            .innerHTML = ""

        let div =

            document.createElement(
                "div"
            )

        div.className =
            "subject"

        div.innerHTML =

            `

<input
class="name"
placeholder="Subject Name"
>

<input
class="mark"
placeholder="Marks"
>

<button
class="remove"
>

X

</button>

`


        div
            .querySelector(
                ".remove"
            )
            .onclick =

            () => {

                div.remove()

            }


        document
            .getElementById(
                "subjects"
            )
            .appendChild(
                div
            )

    }



document
    .getElementById(
        "predictBtn"
    )
    .onclick =

    async function () {

        let subjects = {}

        document
            .querySelectorAll(
                ".subject"
            )
            .forEach(

                s => {

                    let name =

                        s.querySelector(
                            ".name"
                        ).value

                    let mark =

                        parseFloat(

                            s.querySelector(
                                ".mark"
                            ).value

                        )

                    if (
                        name &&
                        !isNaN(mark)
                    ) {

                        subjects[name] = mark

                    }

                }

            )



        let study =

            document
                .getElementById(
                    "study"
                ).value

        let attendance =

            document
                .getElementById(
                    "attendance"
                ).value

        let previous =

            document
                .getElementById(
                    "previous"
                ).value

        let assignment =

            document
                .getElementById(
                    "assignment"
                ).value



        if (

            !study ||

            !attendance ||

            !previous ||

            !assignment ||

            Object.keys(subjects).length === 0

        ) {

            document
                .getElementById(
                    "result"
                )
                .innerText =

                "Fill All Fields"

            return

        }



        document
            .getElementById(
                "loader"
            )
            .style.display =

            "block"


        try {


            let response =

                await fetch(

                    `/predict?study=${study}&attendance=${attendance}&previous=${previous}&assignment=${assignment}&subjects=${encodeURIComponent(JSON.stringify(subjects))}`

                )



            let score =

                parseFloat(

                    await response.text()

                )



            document
                .getElementById(
                    "loader"
                )
                .style.display =

                "none"



            let result =

                document
                    .getElementById(
                        "result"
                    )

            result.style.opacity = 1

            result.innerText =

                "Predicted Score : "

                +

                score



            history.push(
                score
            )


            chart.data.labels.push(
                history.length
            )

            chart.data.datasets[0]
                .data.push(
                    score
                )

            chart.update()



            document
                .getElementById(
                    "totalPredictions"
                )
                .innerText =

                history.length


            document
                .getElementById(
                    "averagePrediction"
                )
                .innerText =

                (

                    history.reduce(
                        (a, b) => a + b,
                        0
                    )

                    /

                    history.length

                ).toFixed(2)



            let li =

                document.createElement(
                    "li"
                )

            li.innerText =

                "Score : "

                +

                score


            document
                .getElementById(
                    "historyList"
                )
                .prepend(
                    li
                )


        }
        catch {

            document
                .getElementById(
                    "result"
                )
                .innerText =

                "Prediction Failed"

        }

        finally {

            document
                .getElementById(
                    "loader"
                )
                .style.display =

                "none"

        }

    }