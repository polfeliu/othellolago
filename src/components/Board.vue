<template>
    <v-container >
        <v-row >
            <v-col class='grey lighten-3' >
                <h3 >
            Whites: {{whiteCells}}
                </h3>
            </v-col>
            <v-col>
                <h3>
                    LeftCells: {{leftCells}}
                </h3>
            </v-col>
            <v-col class="grey darken-4 white--text">
                <h3>
            Blacks: {{blackCells}}
                </h3>
            </v-col>

        </v-row>
        <v-row justify="center" v-bind:class="{ 'grey lighten-3': myColorWhite, 'grey darken-4': !myColorWhite }" >

            <v-col>

                <h2>
                        <span v-if="myColorWhite">
                            You are:
                            Whites
                        </span>
                    <span v-else class="white--text">
                        You are:
                            Blacks
                        </span>
                    <span v-if="active">
                         Your Turn!
                    </span>
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-container class="grey lighten-10">


                <v-row no-gutters v-for="row in cells" :key="row.y" class="ma-0" align="center" justify="center">
                    <div v-for="cell in row" :key="cell.x" class="cell-block" @click="ClickCell(cell.x,cell.y)">
                        <div class="cell green darken-3">
                            <vue-flip height="80px" width="80px" horizontal v-model="cells[cell.y][cell.x].sideWhite"
                                      v-show="cells[cell.y][cell.x].show"
                                      :transition=" cells[cell.y][cell.x].show ? '400ms' : '0s' "
                            >
                                <template v-slot:front>
                                    <v-card class="side black rounded-circle" :elevation="24">
                                    </v-card>
                                </template>
                                <template v-slot:back>
                                    <v-card class="side white rounded-circle" :elevation="24">

                                    </v-card>
                                </template>
                            </vue-flip>
                        </div>
                    </div>
                </v-row>
            </v-container>
        </v-row>
    </v-container>

</template>

<script>
    /* eslint-disable    vue/no-unused-components     */
    /* eslint-disable       no-unused-vars    */

    import VueFlip from 'vue-flip';

    export default {
        name: 'Board',
        components: {
            'vue-flip': VueFlip
        },
        props: {
            active: {
                type: Boolean,
                default: true
            },
            myColorWhite: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                cells: [],
                whiteCells: 0,
                blackCells: 0,
                lost: true,
                won: false,
            }
        },

        computed: {
          leftCells: function () {
            return 64 - this.whiteCells - this.blackCells
          }
        },

        methods: {

            CheckPossibleMoves: function (){
                var x;
                var y;
                for (y = 0; y < 8; y++) {
                    for (x = 0; x < 8; x++) {
                        if(this.analyzeMove(x,y,this.myColorWhite)){
                            return true
                        }
                    }
                }
                return false
            },

            setCell: function (x, y, show, sideWhite) {

                const row = this.cells[y]

                // Update cell Counter
                if (show) {
                    if (sideWhite) {
                        this.whiteCells++
                    } else {
                        this.blackCells++
                    }
                    if(row[x].show){
                        //Flipped Cell
                        if (sideWhite) {
                           this.blackCells--
                        } else {
                            this.whiteCells--
                        }
                    }
                }

                //Change Cell
                row[x].show = show
                row[x].sideWhite = sideWhite
                this.$set(this.cells, y, row) // Set with vue reactiveness
            },


            ClickCell: function (x, y) {

                if (this.active) {
                    var result = this.analyzeMove(x, y, this.myColorWhite)
                    if (result) {
                        this.setCell(x, y, true, this.myColorWhite)
                        this.sendMove(x, y)
                        this.FlipCells(result, this.myColorWhite)
                    }
                }
            },

            FlipCells: function (cells, ColorWhite) {

                cells.forEach(function (cell, i) {
                    setTimeout(function () {
                        this.setCell(cell.x, cell.y, true, ColorWhite)
                    }.bind(this), 200 * i)
                }.bind(this))
            },

            analyzeMove: function (x, y, myColorWhite) {
                const vectors = [
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 0, y: 1},
                    {x: -1, y: 1},
                    {x: -1, y: 0},
                    {x: -1, y: -1},
                    {x: 0, y: -1},
                    {x: 1, y: -1}
                ]

                var moves = [];

                // If there is already a cell, it is not a valid move
                if (this.cells[y][x].show) {
                    return false
                }

                for (var veci = 0; veci < vectors.length; veci++) {
                    var l = 0;
                    var vecmoves = [];
                    for (; ;) {
                        l++;
                        var posx = x + vectors[veci].x * l
                        var posy = y + vectors[veci].y * l

                        //Out of board
                        if (posx < 0) {
                            break
                        }
                        if (posx > 7) {
                            break
                        }
                        if (posy < 0) {
                            break
                        }
                        if (posy > 7) {
                            break
                        }

                        if (l > 50) {
                            //Error ocurred, prevent crash
                            throw new Error('Error while analyzing move!')
                        }

                        var cell = this.cells[posy][posx]

                        if (!cell.show) {
                            //No cell, cannot flip in this direction

                            break;
                        } else if (cell.sideWhite != myColorWhite) {
                            //Cell with opposed color, could be a cell to flip

                            vecmoves.push({
                                x: posx,
                                y: posy
                            })
                        } else {
                            //Cell with same color, flip saved moves and stop searching in this direction

                            moves = moves.concat(vecmoves)
                            break;
                        }

                    }
                }

                if (moves.length == 0) {
                    return false
                } else {
                    return moves
                }
            },

            sendMove: function (x, y) {
                this.$emit('sendMove', x, y);
            },

            receiveMove: function (x, y) {

                var result = this.analyzeMove(x, y, !this.myColorWhite)
                if (!result) {
                    //Error
                } else {
                    this.setCell(x, y, true, !this.myColorWhite)
                    this.FlipCells(result, !this.myColorWhite)

                    setTimeout(function () {
                        //Check if I can move and if not pass turn
                        if(!this.CheckPossibleMoves()){
                            this.$emit('passTurn');
                        }
                    }.bind(this), 200 * (result.length + 1))

                }

            },

            resetBoard: function () {
                this.cells.forEach(function (row, i) {
                    row.forEach(function (cell, j) {
                        if (cell.x == 3 && cell.y == 3) {
                            this.setCell(cell.x, cell.y, true, true)
                        } else if (cell.x == 4 && cell.y == 3) {
                            this.setCell (cell.x, cell.y, true, false)
                        } else if (cell.x == 4 && cell.y == 4) {
                            this.setCell (cell.x, cell.y, true, true)
                        } else if (cell.x == 3 && cell.y == 4) {
                            this.setCell (cell.x, cell.y, true, false)
                        }else{
                            this.setCell (cell.x, cell.y, false, true)
                        }
                    }.bind(this));
                }.bind(this));
            }

        },


        created: function () {
            var x;
            var y;
            for (y = 0; y < 8; y++) {
                this.cells[y] = []

                for (x = 0; x < 8; x++) {
                    this.cells[y].push({
                        x: x,
                        y: y,
                        show: false,
                        sideWhite: true
                    })
                }
            }

        },

        mounted: function () {
            this.resetBoard()
        }
    }
</script>

<style scoped>
    .cell-block {
        display: inline-block;
        margin: 2px
    }

    .cell {
        height: 100px;
        width: 100px;
        padding: 10px;
    }


    .side {
        height: 80px;
        width: 80px;
    }

    vue-flip {
        transition: 0s
    }


</style>
