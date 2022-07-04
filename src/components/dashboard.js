import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default class dashboard extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.state = {
            dashboard_list: '',
            balance_list: '',
            getGraphPrint: [],
            totalSalesCountData: [],
            totalEthCountData: [],
            totalNFTSoldData: [],
            totalUsersCountData: [],
            type: '',
            type1: '',
            type2: '',
            type3: '',
            type5: '',
        }
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.dashboardList();
        this.balanceList()
        this.getGraphAPIData()
        this.totalSalesCountAPI()
        this.totalNFTSoldAPI()
        this.totalUsersCountAPI()
        this.totalEthCountDataAPI()
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if (e.target.name == 'type') {
            this.getGraphAPIData(e.target.value)

        }
        if (e.target.name == 'type1') {
            this.totalSalesCountAPI(e.target.value)

        }
        if (e.target.name == 'type2') {
            this.totalNFTSoldAPI(e.target.value)

        }
        if (e.target.name == 'type3') {
            this.totalUsersCountAPI(e.target.value)

        }
        if (e.target.name == 'type5') {
            this.totalEthCountDataAPI(e.target.value)

        }
    }


    //=======================================  NFTs count details  =====================

    async getGraphAPIData(id) {
        if (!id) {
            id = 7
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}totalNftsCount`,
            data: { type: id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getGraphPrint: result.data.response,

                    })
                    console.log(this.state.getGraphPrint);
                }
                else if (result.data.success === false) {
                    this.setState({
                        getGraphPrint: []

                    })
                    console.log(this.state.getGraphPrint);
                }
            }).catch(err => {
                this.setState({
                    getGraphPrint: []

                })
                console.log(this.state.getGraphPrint);
            });
    }
    

    //=======================================  totalEthCountData  =====================

    async totalEthCountDataAPI(id) {
        if (!id) {
            id = 7
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}totalUsersBalance`,
            data: { type: id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        totalEthCountData: result.data.response,

                    })
                }
                else if (result.data.success === false) {
                    this.setState({
                        totalEthCountData: []

                    })
                }
            }).catch(err => {
                this.setState({
                    totalEthCountData: []

                })

            });
    }


    //=======================================  Total sale  =====================

    async totalSalesCountAPI(id) {
        if (!id) {
            id = 7
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}totalSalesCount`,
            data: { type: id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        totalSalesCountData: result.data.response,

                    })
                }
                else if (result.data.success === false) {
                    this.setState({
                        totalSalesCountData: []

                    })
                }
            }).catch(err => {
                this.setState({
                    totalSalesCountData: []

                })

            });
    }

    //=======================================  totalNFTSold  =====================

    async totalNFTSoldAPI(id) {
        if (!id) {
            id = 7
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}totalNFTSold`,
            data: { type: id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        totalNFTSoldData: result.data.response,

                    })
                }
                else if (result.data.success === false) {
                    this.setState({
                        totalNFTSoldData: []

                    })
                }
            }).catch(err => {
                this.setState({
                    totalNFTSoldData: []

                })

            });
    }

    //=======================================  totalUsersCount  =====================

    async totalUsersCountAPI(id) {
        if (!id) {
            id = 7
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}totalUsersCount`,
            data: { type: id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        totalUsersCountData: result.data.response,

                    })
                }
                else if (result.data.success === false) {
                    this.setState({
                        totalUsersCountData: []

                    })
                }
            }).catch(err => {
                this.setState({
                    totalUsersCountData: []

                })

            });
    }

    async dashboardList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}dashboarditem`,
                data: {}
            })
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            dashboard_list: result.data.response
                        })
                    }
                    else if (result.data.success === false) {
                    }
                })

                .catch(err => {
                })
    }

    //=============================================  Balance Info  =============================

    async balanceList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}totalBalance`,
                data: {}
            })
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            balance_list: result.data.response
                        })
                    }
                    else if (result.data.success === false) {
                    }
                })

                .catch(err => {
                })
    }


    render() {
        return (
            <>
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="fixed-sidebar-right">
                        <ul className="right-sidebar">
                            <li>
                                <div className="tab-struct custom-tab-1">
                                    <ul role="tablist" className="nav nav-tabs" id="right_sidebar_tab">
                                        <li className="active" role="presentation"><a aria-expanded="true" data-toggle="tab" role="tab" id="chat_tab_btn" href="#chat_tab">chat</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="messages_tab_btn" role="tab" href="#messages_tab" aria-expanded="false">messages</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="todo_tab_btn" role="tab" href="#todo_tab" aria-expanded="false">todo</a></li>
                                    </ul>
                                    <div className="tab-content" id="right_sidebar_content">
                                        <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                            <div className="chat-cmplt-wrap">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop "></div>
                    <div className="page-wrapper react-graph">
                        <div className="container-fluid pt-25">
                            <div className="row dashboar-main">
                                <div className='col-lg-1'></div>
                                <div className="col-lg-2 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash1.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.balance_list.total} ETH</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total In Ethereum</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-2 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash1.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.nft_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total NFT's </span>

                                                            </div>
                                                            <div className='col-xs-12'>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash1.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.today_nft_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Today's Total NFT's </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-lg-2 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash2.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100 counter">{this.state.dashboard_list.total_sale_ada}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Sales  </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash2.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75  counter ">{this.state.dashboard_list.today_sale_ada}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Today's Total Sale </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-lg-2 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash3.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.sold_nft}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total NFT sold </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash3.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.sold_nft_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's Total Sold NFT's </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-lg-2 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash4.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.user_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total User</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-1'></div>
                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash4.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.user_count_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's User</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash5.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.total_fee}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Fees</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash5.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.total_fee_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's Total Fees</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            <div className='container pt-2'>
                                <div className=''>
                                    <div className='row'>

                                    <div className='col-md-6'>
                                            <h3 className='nft-graph text-center'>Total ETH</h3>
                                            {this.state.totalEthCountData.length > 0 ?
                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type5' value={this.state.type5} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <LineChart width={470} height={300} data={this.state.totalEthCountData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>
                                                </>
                                                :

                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type5' value={this.state.type5} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <img style={{ width: '400px', height: '258px', marginLeft: '50px' }} src='images/no-chart-data.svg' /><br />
                                                    <p className='text-center'><strong> No Total ETH yet</strong></p>

                                                </>
                                            }
                                        </div>

                                        <div className='col-md-6'>
                                            <h3 className='nft-graph text-center'>Total NFT'S</h3>
                                            {this.state.getGraphPrint.length > 0 ?
                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type' value={this.state.type} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <LineChart width={470} height={300} data={this.state.getGraphPrint} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>
                                                </>
                                                :

                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type' value={this.state.type} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <img style={{ width: '400px', height: '258px', marginLeft: '50px' }} src='images/no-chart-data.svg' /><br />
                                                    <p className='text-center'><strong> No NFT'S yet</strong></p>

                                                </>


                                            }
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>


                            <div className='container pt-2'>
                                <div className=''>
                                    <div className='row'>
                                     
                                        <div className='col-md-6'>
                                            <h3 className='nft-graph text-center'>Total sales</h3>
                                            {this.state.totalSalesCountData.length > 0 ?
                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type1' value={this.state.type1} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <LineChart width={470} height={300} data={this.state.totalSalesCountData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>
                                                </>
                                                :

                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type1' value={this.state.type1} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <img style={{ width: '400px', height: '258px', marginLeft: '50px' }} src='images/no-chart-data.svg' /><br />
                                                    <p className='text-center'><strong> No sales yet</strong></p>

                                                </>
                                            }
                                        </div>

                                        <div className='col-md-6'>
                                            <h3 className='nft-graph text-center'>NFT'S Sold</h3>
                                            {this.state.totalNFTSoldData.length > 0 ?
                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type2' value={this.state.type2} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-sm-4' style={{ marginBottom: '35px' }}>


                                                    </div>
                                                    <LineChart width={470} height={300} data={this.state.totalNFTSoldData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>

                                                </>
                                                :

                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type2' value={this.state.type2} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <img style={{ width: '400px', height: '258px', marginLeft: '50px' }} src='images/no-chart-data.svg' /><br />
                                                    <p className='text-center'><strong> No NFT'S Sold yet</strong></p>

                                                </>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='container pt-2'>
                                <div className=''>
                                    <div className='row'>
                                  
                                        <div className='col-md-6'>
                                            <h3 className='nft-graph text-center'>User Count</h3>
                                            {this.state.totalUsersCountData.length > 0 ?
                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type3' value={this.state.type3} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <br/>
                                                    <br/>
                                                    <LineChart width={470} height={300} data={this.state.totalUsersCountData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>

                                                </>
                                                :

                                                <>
                                                    <div className='graph-dropdown'>
                                                        <select className='form-control' name='type3' value={this.state.type3} onChange={this.onChange}>
                                                            <option value="7">All Time</option>
                                                            <option value="1">Last 1 Days</option>
                                                            <option value="2">Last 7 Days</option>
                                                            <option value="3">Last 30 Days</option>
                                                        </select>
                                                    </div>
                                                    <img style={{ width: '400px', height: '258px', marginLeft: '50px' }} src='images/no-chart-data.svg' /><br />
                                                    <p className='text-center'><strong> No User yet</strong></p>

                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>




                    <Footer />
                </div>

            </>
        )
    }
}