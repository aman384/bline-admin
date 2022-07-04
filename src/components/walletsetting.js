import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
const headers = {
    'Content-Type': 'application/json'
};


export default class walletSetting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            adminwalletData: [],
            admin_address: '',
            admin_private_key: '',
            live_auction: '',
            admin_commission: '',
            royalty_commission: '',
            spinLoader: 0,
            isDialogOpen: false
        }

        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.updateSetting = this.updateSetting.bind(this);

    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.getWalletDetailsAPI()
        this.getSettingAPI()
    }

    async getWalletDetailsAPI() {
        var web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = config.marketplaceContract;
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        var from_address = accounts[0];
        web3.eth.defaultAccount = from_address;
        let myToken = await contract.methods.settlementFeeAddress().call();
        this.setState({
            admin_address: myToken
        })

    }


    async getSettingAPI() {
        await axios.get(`${config.apiUrl}/getSetting`)
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        live_auction: result.data.response.live_auction,
                        admin_commission: result.data.response.admin_commission,
                        royalty_commission: result.data.response.royalty_commission
                    })
                }
                else if (result.data.success === false) {

                }
            })
            .catch(err => {

            })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }



    async updateSetting() {
        this.setState({
            spinLoader: '1',
            isDialogOpen: true
        })
        if (window.ethereum) {
            this.setState({
                spinLoader: '1',
                isDialogOpen: true
            })
            var web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];
            if (currentNetwork !== '0x4') {
                toast.error('Please select ETH Smartchain!!');
                this.setState({
                    spinLoader: '0',
                    isDialogOpen: false
                })
                return false;
            }
            var chainId = '0x4';
            try {
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                await contract.methods.setsettlementFeePercentage(this.state.admin_commission * 1000).call();

                let tx_builder = await contract.methods.setsettlementFeePercentage(this.state.admin_commission * 1000);

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + parseInt(10000000000);

                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });
                this.updateSettingData()
                this.setState({
                    isDialogOpen: false
                })

            } catch (err) {

                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

                    } else {
                        toast.error(err.message);
                    }
                }

                this.setState({
                    spinLoader: 0,
                    isDialogOpen: false
                })
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                spinLoader: 0,
                isDialogOpen: false
            })
            return false;
        }

    }


    async updateSettingData() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}/updateAdminSetting`,
            data: {
               
                "admin_commission": this.state.admin_commission,
              
            }
        })
            .then(async result => {
                if (result.data.success === true) {
                    await Swal.fire({
                        icon: 'success',
                        text: "Setting data updated successfully"
                    })
                }
                else if (result.data.success === false) {
                    await Swal.fire({
                        icon: 'error',
                        text: "Ethereum network overloaded, please try again later."
                    })
                }
            }).catch(err => {
                console.log(err);
            });
    }
    render() {
        return (
            <>
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>

                <Dialog
                        title="Warning"
                        icon="warning-sign"
                        style={{
                            color: 'red'
                        }}
                        isOpen={this.state.isDialogOpen}
                        isCloseButtonShown={false}
                    >
                        <div className="text-center">
                            <BarLoader color="#e84747" height="2" />
                            <br />
                            <h4 style={{ color: '#000' }}>Transaction under process...</h4>
                            <p style={{ color: 'red' }}>
                                Please do not refresh page or close tab.
                            </p>
                            <div>
                            </div>
                        </div>
                    </Dialog>

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
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">


                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">

                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Settlement fees address</label>
                                                                <input type="text" onChange={this.handleChange} name="admin_address" disabled className="form-control" placeholder="Settlement fees address" value={this.state.admin_address} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Admin Commission(%)</label>
                                                                <input type="number" onChange={this.handleChange} name="admin_commission" className="form-control" value={this.state.admin_commission} />
                                                            </div>
                                                        </div>



                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Live Auction</label>
                                                                <input type="date" onChange={this.handleChange} name="live_auction" className="form-control" value={this.state.live_auction} />
                                                            </div>
                                                        </div> */}

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10"></label>
                                                                <button style={{ marginTop: "30px" }} disabled={!this.state.admin_commission} type="submit" onClick={this.updateSetting} className="btn btn-primary">Update</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-actions">
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                                <div className="form-wrap"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}