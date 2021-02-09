<template>
    <v-app id="inspire" >
        <div id="app" class="light-green lighten-3">


            <h2 v-if="!browserSupported">You're browser does not support webRTC please use a modern browser.</h2>




            <v-container >
                <v-row class="light-green darken-1">
                    <v-col>

                        <h2>
                            ID: {{ ownId }}
                        </h2>

                        <v-btn type="button" color="secondary"
                                v-clipboard:copy="ownId"
                               >
                            Copy!</v-btn>

                    </v-col>


                    <v-col >


                        <v-text-field v-model="peerId" label="peerID" :disabled="connecting||connected" >

                        </v-text-field>

                    </v-col>
                    <v-col>
                        <v-btn color="primary" @click="connect" :disabled="connected" class="ma-3">
                            Connect
                        </v-btn>

                        <v-btn color="error" @click="disconnect" :disabled="!connected">
                            Disconnect
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row justify="center"  class="light-green darken-1">
                    <v-alert
                            border="right"
                            colored-border
                            type="error"
                            elevation="2"
                            v-model="peeralreadyplaying"
                            transition="scale-transition"
                            min-width="300px"
                    >
                        This peer is already playing
                    </v-alert>

                    <v-alert
                            border="right"
                            colored-border
                            type="error"
                            elevation="2"
                            v-model="peernotfound"
                            transition="scale-transition"
                            min-width="300px"
                    >
                        Peer not found
                    </v-alert>

                    <v-alert
                            border="right"

                            type="info"
                            elevation="2"
                            v-model="passedTurn"
                            transition="scale-transition"
                            min-width="600px"
                    >
                        <h4>
                        Passed turn since no move was possible
                        </h4>
                    </v-alert>
                </v-row>

<v-row  class="rounded-t-xl mt-10">
                <Board
                        @sendMove="sendMove"
                        @passTurn="passTurn"
                        ref="board"
                        :active="myTurn"
                        :myColorWhite="myColorWhite">

                </Board>
</v-row>
            </v-container>



        </div>
    </v-app>
</template>

<script>
    /* eslint-disable    vue/no-unused-components     */
    /* eslint-disable       no-unused-vars    */

    import Board from "@/components/Board";


    export default {
        name: 'App',
        components: {
            Board
        },

        data: function () {
            return {
                browserSupported: true,
                loading: true,
                ownId: 'loading',
                peerId: '',
                msg: 'welcome',
                connected: false,
                connecting: false,
                connection: null,
                peeralreadyplaying: false,
                peernotfound: false,
                myColorWhite: true,
                myTurn: false,
                passedTurn: false,
            }
        },


        methods: {
            send: function(msg){
                this.connection.send(
                    JSON.stringify(msg)
                )
            },

            passTurn: function(x,y){
              this.myTurn = false
                this.send('passTurn')
                this.passedTurn = true;
            },

            sendMove: function(x,y){
                this.myTurn = false
                this.send({
                    move: {
                        x: x,
                        y: y,
                    }
                })

            },

            receiveMove: function(x,y){
                this.$refs.board.receiveMove(x,y)
                this.myTurn = true
                this.passedTurn = false;
            },


            setListeners: function (conn) {
                conn.on('data', (data) => {
                    data = JSON.parse(data);
                    console.log("data", data);

                    if('move' in data){
                        this.receiveMove(data.move.x, data.move.y)
                    }else if(data == "passTurn"){
                        this.myTurn = true
                    }
                });

                conn.on('close', () => {
                    if (this.connection.peer == conn.peer) {
                        //Connection with current user was closed
                        this.connection = null
                        this.connected = false
                        this.peerId = ""
                    }
                    console.log("close connection")
                });

                conn.on('error', (err) => {
                    console.error(err);
                });


                //Incoming connection
                conn.on('open', () => {
                    if (!this.connected) {
                        //Accept Connection
                        this.connected = true;
                        this.connection = conn;
                        this.connecting = false
                        this.peerId = conn.peer;
                        this.myColorWhite = false;
                        this.myTurn = true
                    } else {
                        //Reject Connection
                        setTimeout(function () {
                            this.send({
                                "error": "I'm already playing"
                            })
                            conn.close();
                        }, 500)

                    }

                });
            },


            // Request a connection
            connect: function () {
                const conn = this.$peer.connect(this.peerId, {
                    label: 'user',
                    metadata: {
                        name: 'userName'
                    },
                    serialization: 'json',
                });

                this.connecting = true

                conn.on('open', () => {
                    if (!this.connected) {
                        this.connection = conn
                        this.connected = true
                        this.connecting = false
                        this.setListeners(conn);
                    }
                });


                setTimeout(function () {
                    if (this.connecting) {
                        this.peernotfound = true
                    }
                }.bind(this), 1500)

            },

            disconnect: function () {
                this.connection.close();
            }


        },
        created() {
            this.$peer.on('open', (id) => {
                this.loading = false;
                this.ownId = id;
            });

            this.$peer.on('connection', (conn) => {
                this.setListeners(conn);
            });

            this.$peer.on('close', () => {
                console.log('close peer');

            });

            this.$peer.on('disconnected', () => {
                console.log('dis');
            });
        },
    }


</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
