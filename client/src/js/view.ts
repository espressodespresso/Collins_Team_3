import M = require("./mission.js")
import {Chart, LinearScale, Title, Tooltip, Legend, BarController, BarElement} from "chart.js";

export enum Stage {
    Map,
    Table,
    Hi***REMOVED***ogram
}

export class View {
    private _***REMOVED***age: Stage;

    con***REMOVED***ructor() {
        this._***REMOVED***age = Stage.Map;
    }

     setView(value: Stage, missions: M.Mission[]) {
        let container = document.getElementById("row-container");
        if(value !== this._***REMOVED***age) {
            switch (this._***REMOVED***age) {
                case Stage.Map:
                    let map = document.getElementById("map");
                    container.removeChild(map);
                    break
                case Stage.Table:
                    let table = document.getElementById("table");
                    container.removeChild(table);
                    break;
                case Stage.Hi***REMOVED***ogram:
                    let hi***REMOVED***ogram = document.getElementById("hi***REMOVED***ogram");
                    container.removeChild(hi***REMOVED***ogram);
            }

            switch (value) {
                case Stage.Map:
                    this.initMap();
                    break;
                case Stage.Table:
                    this.initTable(missions)
                    break;
                case Stage.Hi***REMOVED***ogram:
                    this.initHi***REMOVED***ogram(missions);
                    break;
            }
        }
    }

    private initMap() {
        let mapElement = document.createElement("div");
        mapElement.id = "map";
        mapElement.classLi***REMOVED***.add("col", "m-0", "p-0", "w-auto")
        document.getElementById("row-container").appendChild(mapElement);
    }

    private initTable(missions: M.Mission[]) {
        // Create table container & define table element
        let divParent = document.createElement("div");
        divParent.id = "table";
        divParent.classLi***REMOVED***.add("col", "p-3", "overflow-y");
        let tableElement = document.createElement("table");
        tableElement.classLi***REMOVED***.add("table", "text-light");

        // Define table head, append to table element

        let tableHead = document.createElement("thead");
        let trElement = document.createElement("tr");
        let headItems = ["#", "Products", "Countrycode", "Fir***REMOVED*** FrameTime"
            , "Aircraft Takeoff Time", "Center Position"];
        for(let i=0; i < headItems.length; i++) {
            let thElement = document.createElement("th");
            thElement.scope = "col";
            thElement.append(document.createTextNode(headItems[i]));
            trElement.appendChild(thElement);
            console.log(thElement);
        }
        tableHead.append(trElement);
        tableElement.appendChild(tableHead);

        // Define table body & dynamically add table data

        let tableBody = document.createElement("tbody");
        for(let i=0; i < missions.length; i++) {
            let mission = missions[i];
            trElement = document.createElement("tr");
            let thElement = document.createElement("th");
            thElement.scope = "row";
            let count = 1;
            thElement.append(document.createTextNode(count.toString()));
            trElement.appendChild(thElement);
            for(let j=0; j < mission.scenes.length; j++) {
                let scene = mission.scenes[j];
                trElement.appendChild(this.createtdElement(`${mission.name} ${scene.name}`));
                trElement.appendChild(this.createtdElement(scene.countrycode));
                trElement.appendChild(this.createtdElement(scene.fir***REMOVED***FrameTime.toString()));
                trElement.appendChild(this.createtdElement(mission.aircraftTakeTime.toString()));
                trElement.appendChild(this.createtdElement(scene.center.toString()));
                count += 1;
            }
            tableBody.appendChild(trElement);
        }
        tableElement.appendChild(tableBody);
        divParent.appendChild(tableElement);
        console.log(divParent);
        document.getElementById("row-container").appendChild(divParent);
    }

    private createtdElement(value: ***REMOVED***ring) {
        let tdElement = document.createElement("td");
        tdElement.append(document.createTextNode(value));
        return tdElement;
    }

    private initHi***REMOVED***ogram(mission: M.Mission[]) {
        let divParent = document.createElement("div");
        divParent.id = "hi***REMOVED***ogram";
        divParent.classLi***REMOVED***.add("col", "p-3");
        let ctx = document.createElement("canvas");
        Chart.regi***REMOVED***er(LinearScale, Title, Tooltip, Legend, BarController, BarElement);
        let te***REMOVED*** = [ // Replace with data once available
            {x: 0.5, y: 10},
            {x: 1.5, y: 9},
            {x: 2.5, y: 8},
            {x: 3.5, y: 2},
            {x: 4.5, y: 5},
            {x: 5.5, y: 7},
            {x: 6.5, y: 1},
            {x: 7.5, y: 2},
            {x: 8.5, y: 4},
            {x: 9.5, y: 8},
            {x: 10.5, y: 1},
            {x: 11.5, y: 3},
            {x: 12.5, y: 7},
            {x: 13.5, y: 5},
            {x: 14.5, y: 9},
            {x: 15.5, y: 10},
            {x: 16.5, y: 10},
            {x: 17.5, y: 2},
            {x: 18.5, y: 4},
            {x: 19.5, y: 1},
            {x: 20.5, y: 6},
            {x: 21.5, y: 7},
            {x: 22.5, y: 2},
            {x: 23.5, y: 4}
        ];
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: te***REMOVED***,
                    borderWidth: 1,
                    barPercentage: 1,
                    categoryPercentage: 1,
                    borderRadius: 5
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        offset: false,
                        grid: {
                            offset: false
                        },
                        ticks: {
                            ***REMOVED***epSize: 3
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'No. of Missions'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (te***REMOVED***) => {
                                if(!te***REMOVED***.length) {
                                    return "";
                                }
                                con***REMOVED*** item = te***REMOVED***[0];
                                con***REMOVED*** x = item.parsed.x;
                                con***REMOVED*** min = x - 0.5;
                                con***REMOVED*** max = x + 0.5;
                                return `Hours: ${min} - ${max}`;
                            }
                        }
                    }
                }
            }
        });
        divParent.appendChild(ctx);
        document.getElementById("row-container").appendChild(divParent);
    }
}