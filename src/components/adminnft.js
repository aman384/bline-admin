import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
// import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
export default class adminnft extends Component {
    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        console.log(this.loginData);
        this.state = {
            item_id: '',
            name: '',
            description: '',
            image: '',
            blockchainType: '1',
            owner_id: '',
            file_name: 'Select File',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            item_subcategory_id: '',
            price: '',
            collection_id: '',
            user_id: '',
            is_sold: '',
            imageData: "",
            expiry_date: '',
            start_date: '',
            sell_type: '',
            sell_type_text: '',
            bid_list: [],
            royaltie: 0,
            quantity: '',
            loader: '',
            spinLoader: 0,
            category_list: [],
            item_list1: [],
            admin_collection_list: [],
            gamesCategoryRes: [],
            ImageFileHash: '',
            isDialogOpen: false,
            SingleCategoryData: [],
            isPutonSale: 0,
            isDialogOpen1: false,
            currentDate: '',
            isDialogOpenBid: false
        }

        this.editDataAPI = this.editDataAPI.bind(this);
        this.onChange = this.itemDetail.bind(this)
        this.updateItemData = this.updateItemData.bind(this)
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },

            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl + 'nftDetails/' + item.id}`} target="_blank" >
                                {item.name}
                            </a>

                        </>
                    );
                }
            },
            // {
            //     key: "description",
            //     text: "Description",
            //     sortable: true
            // },

            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {!item.image
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl}${item.image}`} target="_balnk">
                                    <img width="80px" src={`${config.imageUrl}` + item.image} />
                                </a>
                            }
                        </>
                    );
                }
            },

            {
                key: "item_category",
                text: "Category Name",
                sortable: true
            },
            {
                key: "is_featured",
                text: "Trending",
                sortable: true,
                cell: (item) => {
                    return (
                        <>

                            {/* {alert(item.expiry_date)}
                        {alert(new Date())} */}

                            {/* {alert(item.sell_type == 2 && item.expiry_date < new Date())} */}
                            {(item.sell_type == 2 && new Date(item.expiry_date) > new Date()) || item.sell_type == 1
                                ?
                                <input type='checkbox' checked={item.is_featured === 0 ? '' : 'checked'} onClick={this.updateUserNftFeature.bind(this, item.id, item.is_featured)} /> : <p title='This product is expired!!'>NA</p>

                            }

                        </>
                    )
                }

            },
            {
                key: "price",
                text: "Price",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price + `${item.blockchainType == 1 ? ' ETH' : ' ETH'} `} </span>
                        </>
                    )
                }
            },

            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <> 
                            <div className='d-flex' style={{ display: "flex", position:"relative", height:"26px", width:"216px" }}>
                                {/* <button type="submit" onClick={this.editDataAPI.bind(this, item)} data-toggle="modal" data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp; */}
                                {item.is_active == 1 ?
                                    <button type="submit" onClick={this.hideNFTAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-minus-square m-r-10"></i> </button> :
                                    <button type="submit" onClick={this.showNFTAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-plus-square m-r-10"></i> </button>
                                }&nbsp;
                                {this.loginData?.id == item.owner_id ?
                                    item.is_on_sale == 1 ?
                                            <button type='button' className='btn-primary' id='cancelid'> <a onClick={this.cancelOrder.bind(this, item)} className='putonsale' style={{ color: "#fff" }} > Cancel listing </a></button>
                                        :
                                        <>
                                                <button className='btn-primary'> <Link to={`${config.baseUrl}editNft/` + item.id} className="btn-primary"><i class="fa fa-pencil text-inverse m-r-10"></i></Link>&nbsp;</button>
                                                <button className='btn-primary' id='putonsaleid'>   <a onClick={this.putOnSaleModelAPI.bind(this, item, 1)} className='putonsale' data-toggle="modal" data-target="#putOnSale"> Put on sale </a></button>
                                        
                                        </>
                                    : ""}
                                {item.sell_type == 2 ?
                                    <button
                                        type='button' onClick={this.getBidDetailAPI.bind(this, item)} data-toggle="modal" data-target="#exampleModalCenter" className="btn-primary" id='viewid'>
                                        View Bid</button> : ''
                                }


                            </div>
                        </>
                    );
                }
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50,],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }

    }

    componentDidMount() {
        this.categoryList();
        // this.getItemAPI();
        this.getAdminNFTAPI();
        this.getAdminCollection()
        var dateToday = new Date();
        var month = dateToday.getMonth() + 1;
        var day = dateToday.getDate();
        var year = dateToday.getFullYear();

        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;

        $('#txt-appoint_date').attr('min', maxDate);

        var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var array = startDate.split(' ');
        if (array[0]) {
            this.setState({
                currentDate: array[0],
                endDate: array[0]
            })
        }
    }

    async getAdminCollection() {
        await axios.get(`${config.apiUrl}getAdminCollection`, {},)
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        admin_collection_list: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {

            })
    }


    //=============================================  Single category get  ============================

    async singleGamesCategoryAPI(id) {
        await axios({
            method: 'post',
            url: `${config.apiUrl}singleGamesCategory`,
            data: { "category_id": id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    SingleCategoryData: response.data.response
                })
            }
        })
    }

    closeModal(e) {
        this.setState({
            item_id: '',
            name: '',
            description: '',
            image: '',
            owner_id: '',
            file_name: '',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            price: '',
            user_id: '',
            is_sold: '',
            expiry_date: '',
            start_date: '',
            sell_type: '',
            sell_type_text: '',
            quantity: '',
            loader: '',
        })
    }

    async getAdminNFTAPI() {
        axios.get(`${config.apiUrl}getAdminNFT`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list1: response.data.response
                    })
                }
                else if (response.data.success === false) {

                }
            })
            .catch(err => {

            })
    }

    async getItemAPI() {
        axios.get(`${config.apiUrl}getAdminNFT`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }
                else if (response.data.success === false) {
                }
            })
            .catch(err => {

            })
    }

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getCategory`,
                data: {}
            }).then(result => {
                if (result.data.success === true) {
                    this.setState({
                        category_list: result.data.response
                    })
                }
                else if (result.data.success === false) {

                }
            }).catch(err => {

            })
    }

    async getBidDetailAPI(id) {
        axios.post(`${config.apiUrl}getBidDetail`, { 'item_id': id.id },)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        bid_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            }).catch(err => {
                this.setState({
                    bid_list: []
                })
            })
    }


    async putOnSaleModelAPI(item, type) {
        console.log(item);
        this.setState({
            isPutonSale: 1,
            updateType: type
        })

        $("#nft" + item.item_id).css({ "display": "none" });
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': item.id, 'user_id': this.loginData.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    nftData: response.data.response
                })
            }
        })
    }


    async cancelOrder(item) {
        this.setState({
            isCancelOrder: 1
        })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure want to cancel this order?.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        this.approveNFT(item)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    async BidAcceptAPI(itemData) {
        console.log(itemData.token_id);
        let tokenId = itemData.token_id;
        alert(tokenId)
        if (window.ethereum) {

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);

            var chainId = '0x4';

            try {
                this.setState({
                    processBtn: 1,
                    isDialogOpenBid: true
                })
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];

                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let tx_builder = await contract.methods.acceptBid(tokenId.toString());

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();

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


                if (txData.transactionHash) {
                    const token = this.token
                    axios({
                        method: 'post',
                        url: `${config.apiUrl}bidAccept`,
                        headers: { authorization: token },
                        data: { "user_id": itemData.user_id, "address": from_address, 'item_id': itemData.item_id, "bid_id": itemData.bid_id, "hash": txData.transactionHash }
                    })
                        .then(async response => {
                            if (response.data.success === true) {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                                toast.success(response.data?.msg, {});
                                this.setState({
                                    processBtn: 0,
                                    isDialogOpenBid: false
                                })
                            }
                            else if (response.data.success === false) {
                                this.setState({
                                    processBtn: 0,
                                    isDialogOpenBid: false
                                })
                                toast.error(response.data?.msg, {});
                            }
                        })
                        .catch(err => {
                            this.setState({
                                processBtn: 0,
                                isDialogOpenBid: false
                            })
                            toast.error(err.response.data?.msg, {});
                        })
                    // window.location.reload();
                } else {
                    toast.error('Something went wrong please try again3.');
                    this.setState({
                        processBtn: 0,
                        isDialogOpenBid: false
                    })
                    return false;
                }

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
                    processBtn: 0,
                    isDialogOpenBid: false
                })
                return false;
            }

        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                processBtn: 0,
                isDialogOpenBid: false
            })
            return false;
        }
    }


    handleChange = event => {
        event.persist();
        let value = event.target.value;
        this.setState(prevState => ({
            item_list: { ...prevState.item_list, [event.target.name]: value }
        }))
    };

    handleChange1 = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.checked === true && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (e.target.checked === false && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }

        if (e.target.name == 'item_category_id') {

            this.singleGamesCategoryAPI(e.target.value)
        }
    }

    handleEditImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        let file_name = e.target.files[0].name
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, image_as_base64, 'file_type': file_type, image_file: image_as_files },
            file_name: file_name
        }))
    }

    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
        })
    }

    async imageUpload() {
        let formData1 = new FormData();
        formData1.append('file', this.state.image_file);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let resIPF = await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': '13a09709ea30dc4fcc31',
                    'pinata_secret_api_key': 'b6f2e00b393de9902ead2fb02dfc4a6325df8c7cfe8734e1493f918e7f7aa7c9'
                }
            }
        );
        let ipfsImg = resIPF.data.IpfsHash;
        this.setState({
            ImageFileHash: ipfsImg
        })
        return ipfsImg;
    }

    async metaDataUpload(file) {
        let resIPF = await axios({
            method: 'post',
            url: `${config.apiUrl}createMetadata`,
            data: {
                "name": this.state.item_name,
                "description": this.state.description,
                "image": `https://meme.mypinata.cloud/ipfs/${this.state.ImageFileHash}`
            }
        });
        let tokenId = resIPF.data.tokenId;
        this.setState({
            token_id: tokenId
        })
        return tokenId;

    }

    async createUserNft() {

        if (this.state.item_name == '') {
            toast.error('Item name required');
        }
        else if (this.state.description == '') {
            toast.error('Item description required');
        }
        else if (!this.state.image_file) {
            toast.error('Item image required');
        }
        else if (!this.state.item_category_id) {
            toast.error('Please select category');
        }
        else if (!this.state.user_collection_id) {
            toast.error('Please select collection');
        }
        else if (this.state.sell_type == 2 && !this.state.start_date) {
            toast.error('Please select start date');
        }
        else if (this.state.sell_type == 2 && !this.state.expiry_date) {
            toast.error('Please select end date');
        }
        else if (this.state.price == '') {
            toast.error('Item price required');
        }
        else if (this.state.blockchainType == '') {
            toast.error('Blockchain type required');
        }
        else {

            this.setState({
                spinLoader: '1',
                isDialogOpen: true
            })

            let ImageFileHash = this.state.ImageFileHash;
            if (!ImageFileHash) {
                ImageFileHash = await this.imageUpload();
            }
            let MetadataFileHash = this.state.MetadataFileHash;
            if (!MetadataFileHash) {
                MetadataFileHash = await this.metaDataUpload();
            }
            let metaHash = MetadataFileHash;
            MetadataFileHash = `https://meme.mypinata.cloud/ipfs/${MetadataFileHash}`

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

                // var ETH_mainnet = 0x1;
                // var ETH_testnet = 0x4;

                // let ETH_mainnet = 137;
                // let ETH_testnet = 80001;
                if (this.state.blockchainType == 1) {
                    if (currentNetwork !== '0x4') {
                        toast.error('Please select ETH Network!!');
                        this.setState({
                            spinLoader: '0',
                            isDialogOpen: false
                        })
                        return false;
                    }
                    var chainId = '0x4';
                }

                if (this.state.blockchainType == 2) {
                    toast.error('In Progress');
                    return;
                }

                try {
                    let mintFee = 0;
                    let SalePrice;
                    let start_date = 0;
                    let expiry_date = 0;

                    if (this.state.sell_type == 1) {
                        SalePrice = parseInt(parseFloat(this.state.price) * (10 ** 18)).toString()
                        this.setState({
                            start_date: 0,
                            expiry_date: 0
                        })
                    }

                    else if (this.state.sell_type == 2) {
                        SalePrice = parseInt(parseFloat(this.state.price) * (10 ** 18)).toString();
                        start_date = Math.round(new Date(this.state.start_date).getTime() / 1000);
                        expiry_date = Math.round(new Date(this.state.expiry_date).getTime() / 1000);
                    }

                    let contractAddress = `${config.marketplaceContract}`
                    let from_address = accounts[0];
                    const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

                    await contract.methods._mint(MetadataFileHash.toString(), SalePrice.toString(), (this.state.royaltie * 100).toString(), this.state.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

                    let tx_builder = await contract.methods._mint(MetadataFileHash.toString(), SalePrice.toString(), (this.state.royaltie * 100).toString(), this.state.sell_type.toString(), start_date.toString(), expiry_date.toString());

                    let encoded_tx = tx_builder.encodeABI();
                    let gasPrice = await web3.eth.getGasPrice();
                    gasPrice = parseInt(gasPrice) + parseInt(10000000000);

                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: contractAddress,
                        from: from_address,
                        value: web3.utils.toHex(mintFee),
                        chainId: chainId,
                        data: encoded_tx
                    });

                    // const txData = await web3.currentProvider.request({
                    //     method: 'eth_sendTransaction',
                    //     params: [{
                    //         gasPrice: web3.utils.toHex(gasPrice),
                    //         gas: web3.utils.toHex(gasLimit),
                    //         to: contractAddress,
                    //         from: from_address,
                    //         value: web3.utils.toHex(mintFee),
                    //         chainId: chainId,
                    //         data: encoded_tx
                    //     }],
                    // });

                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: contractAddress,
                        from: from_address,
                        value: web3.utils.toHex(mintFee),
                        chainId: chainId,
                        data: encoded_tx
                    });
                    const result = await web3.eth.getTransactionReceipt(txData.transactionHash);
                    let tokenId = await web3.utils.hexToNumber(result.logs[0].topics[3]);
                    if (txData.transactionHash) {

                        let mintRes = {
                            'ImageFileHash': ImageFileHash,
                            'MetadataFileHash': metaHash,
                            'hash': txData.transactionHash,
                            'tokenId': tokenId,
                            'from_address': from_address,
                            'minting_fee': parseInt(mintFee) / 10 ** 18
                        }
                        this.API(mintRes);
                    } else {
                        toast.error('Something went wrong please try again.');
                        this.setState({
                            spinLoader: '0',
                            isDialogOpen: false
                        })
                        return false;
                    }

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
    }

    async approveNFT(itemDetails) {
        console.log('itemDetails', itemDetails);
        this.setState({
            spinLoader: '1',
            isPutonSale: 0,
            isDialogOpen1: true
        })

        if (window.ethereum) {

            var web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];

            // var ETH_mainnet = 0x1;
            // var ETH_testnet = 0x4;

            // let matic_mainnet = 137;
            // let matic_testnet = 80001;

            console.log('currentNetwork', currentNetwork);
            if (itemDetails.blockchainType == 1) {
                if (currentNetwork !== '0x4') {
                    toast.error('Please select ETH smartchain!!');
                    this.setState({
                        spinLoader: '0',
                        isPutonSale: 1,
                        isDialogOpen1: false
                    })
                    return false;
                }
                var chainId = '0x4';
            }

            if (itemDetails.blockchainType == 2) {
                this.setState({
                    spinLoader: '0',
                    isPutonSale: 1,
                    isDialogOpen1: false
                })
                toast.error('In Progress');
                return;
            }

            try {
                let mintFee = 0;
                let SalePrice;
                let start_date = 0;
                let expiry_date = 0;
                let tokenId = itemDetails.token_id;
                if (itemDetails.sell_type == 1) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString()
                    this.setState({
                        start_date: 0,
                        expiry_date: 0
                    })
                }

                else if (itemDetails.sell_type == 2) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString();
                    start_date = Math.round(new Date(itemDetails.start_date).getTime() / 1000);
                    expiry_date = Math.round(new Date(itemDetails.expiry_date).getTime() / 1000);
                }

                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                console.log(tokenId)
                if (this.state.isCancelOrder == 1) {
                    await contract.methods.cancelOrder(tokenId.toString()).call();
                    var tx_builder = await contract.methods.cancelOrder(tokenId.toString());
                } else {
                    if (itemDetails.is_minted == 1) {
                        await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

                        var tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
                    } else {

                        console.log(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());

                        await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

                        var tx_builder = await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
                    }
                }

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + parseInt(10000000000);

                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });

                // const txData = await web3.currentProvider.request({
                //     method: 'eth_sendTransaction',
                //     params: [{
                //         gasPrice: web3.utils.toHex(gasPrice),
                //         gas: web3.utils.toHex(gasLimit),
                //         to: contractAddress,
                //         from: from_address,
                //         value: web3.utils.toHex(mintFee),
                //         chainId: chainId,
                //         data: encoded_tx
                //     }],
                // });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });

                if (txData.transactionHash) {

                    const token = this.token
                    await axios({
                        method: 'post',
                        url: this.state.isCancelOrder ? `${config.apiUrl}cancelOrder` : `${config.apiUrl}putOnSale`,
                        headers: { authorization: token },
                        data: {
                            "user_id": this.loginData.data.id,
                            "address": from_address,
                            "item_id": this.state.isCancelOrder ? itemDetails.id : this.state.nftData.item_id,
                            "token_hash": txData.transactionHash,
                            "is_minted": itemDetails.is_minted
                        }
                    }).then((res) => {
                        if (res.data.success === true) {


                            toast.success(res.data.msg);
                            this.setState({
                                isDialogOpen1: false
                            })

                            setTimeout(() => {
                                window.location.reload()
                            }, 1000);
                            // this.modalShow(0)
                            // this.getMyNftAPI(itemDetails.nftType)
                            //    toast.error('Please select start date');
                            // toast.success(res.data.msg, {
                            //     position: toast.POSITION.TOP_CENTER
                            // });
                        } else {
                            toast.error(res.data.msg);
                            // toast.error(res.data.msg, {
                            //     position: toast.POSITION.TOP_CENTER
                            // });
                        }
                    }).catch((error) => {
                        toast.error(error.response?.data?.msg, {});
                    })
                } else {
                    toast.error('Something went wrong please try again.');
                    this.setState({
                        spinLoader: '0',
                        isPutonSale: this.state.this.state.isCancelOrder == 1 ? 0 : 1,
                        isDialogOpen1: false
                    })
                    return false;
                }

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
                    spinLoader: '0',
                    isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
                    isDialogOpen1: false
                })
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                spinLoader: '0',
                isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
                isDialogOpen1: false
            })
            return false;
        }
    }

    async API(mintRes) {

        // var approveNFTRes = await this.approveNFT(mintRes);
        // if (approveNFTRes) {

        if (this.state.item_name == '') {
            toast.error('Item name required');
        }
        else if (this.state.description == '') {
            toast.error('Item description required');
        }
        else if (!this.state.image_file) {
            toast.error('Item image required');
        }
        else if (!this.state.item_category_id) {
            toast.error('Please select category');
        }
        else if (!this.state.user_collection_id) {
            toast.error('Please select collection');
        }
        else if (this.state.sell_type == 2 && !this.state.start_date) {
            toast.error('Please select start date');
        }
        else if (this.state.sell_type == 2 && !this.state.expiry_date) {
            toast.error('Please select end date');
        }
        else if (this.state.price == '') {
            toast.error('Item price required');
        }
        else if (this.state.blockchainType == '') {
            toast.error('Blockchain type required');
        }
        this.setState({
            spinLoader: '1',
        })
        let formData = new FormData();
        let ImageFileHash = this.state.ImageFileHash;
        if (!ImageFileHash) {
            ImageFileHash = await this.imageUpload();
        }
        let token_id = this.state.token_id;
        if (!token_id) {
            token_id = await this.metaDataUpload();
        }
        formData.append('price', this.state.price);
        formData.append('image', this.state.ImageFileHash);
        formData.append('metadata', this.state.MetadataFileHash);
        formData.append('name', this.state.item_name);
        formData.append('file_type', this.state.file_type);
        formData.append('royalty_percent', this.state.royaltie);
        formData.append('image_type', this.state.image_type);
        formData.append('description', this.state.description);
        formData.append('start_date', this.state.start_date);
        formData.append('expiry_date', this.state.expiry_date);
        formData.append('item_category_id', this.state.item_category_id);
        formData.append('user_collection_id', this.state.user_collection_id);
        formData.append('sell_type', this.state.sell_type);
        formData.append('user_id', this.loginData?.data?.id);
        formData.append('email', this.loginData?.data?.user_email);
        formData.append('owner_address', this.state?.from_address);
        formData.append('blockchainType', this.state.blockchainType);
        formData.append('hash', this.state.hash);
        formData.append('tokenId', this.state.token_id);
        formData.append('minting_fee', this.state.minting_fee);
        formData.append('item_subcategory_id', this.state.item_subcategory_id);
        this.setState({
            imageData: this.state.ImageFileHash
        })

        axios.post(`${config.apiUrl}addNftByUser`, formData)
            .then(result => {



                if (result.data.success === true) {
                    this.setState({
                        spinLoader: '0',
                        isDialogOpen: true
                    })
                    // setTimeout(() => {
                    //     window.location.href = `${config.baseUrl}adminnft`
                    // }, 2000);
                } else {
                    toast.error(result.data.msg);
                    this.setState({
                        spinLoader: '0',
                        isDialogOpen: false
                    })
                }
            }).catch(err => {
                toast.error(err.response.data?.msg,

                );
                this.setState({
                    spinLoader: '0',
                    isDialogOpen: false
                })
            })
        // } else {
        //     this.setState({
        //         spinLoader: '0'
        //     })
        // }
    }

    handleChangeStart = (date, name) => {

        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [name]: moment(date).format('YYYY-MM-DD') }
        }))
    }

    addhandleChangeStart = (date, name) => {
        this.setState({
            [name]: moment(date).format('YYYY-MM-DD')
        })
    }

    itemDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [event.target.name]: value }
        }))

        if (event.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
            this.getGamesCategoryAPI(event.target.value)
        }
        else if (event.target.checked === true && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (event.target.checked === false && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    async editDataAPI(nftData) {
        console.log(nftData);
        this.setState({
            item_category_id: nftData.item_category_id,
            price: nftData.price,
            item_id: nftData.id,
            user_collection_id: nftData.user_collection_id,
            name: nftData.name,
            is_banner: nftData.is_banner,
            is_featured: nftData.is_featured,
            is_on_sale: nftData.is_on_sale
        })
    }

    async updateItemData(e) {
        e.preventDefault()
        console.log(this.state.is_featured);
        this.setState({
            loader: '1'
        })
        if (!this.state.item_category_id) {
            toast.error('Please Select Category');
            this.setState({
                loader: ''
            })
        }
        else if (this.state.price == '') {
            toast.error('Price Required');
            this.setState({
                loader: ''
            })
        } else if (this.state.user_collection_id == '') {
            toast.error('Collection Required');
            this.setState({
                loader: ''
            })
        } else {
            axios({
                method: 'post',
                url: `${config.apiUrl}updateitem`,
                headers: { "Authorization": this.loginData?.Token },
                data: { 'email': this.loginData?.data.user_email, 'item_id': this.state.item_id, 'item_category_id': this.state.item_category_id, 'name': this.state.name, 'price': this.state.price, 'user_collection_id': this.state.user_collection_id, 'is_banner': this.state.is_banner, 'is_featured': this.state.is_featured, 'is_on_sale': this.state.is_on_sale }
            }).then(result => {
                if (result.data.success === true) {
                    this.setState({
                        loader: ''
                    })
                    toast.success(result.data.msg);
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            }).catch(err => {

                toast.error(err.response.data?.msg);
                this.setState({
                    loader: ''
                })
            })
        }
    }

    hideNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id, is_admin: 1 }
                        })

                            .then(result => {

                                toast.success(result.data.msg);
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data?.msg);
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    showNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id, is_admin: 1 }
                        })
                            //    axios.post(`${config.apiUrl}showNFT`,
                            //  {item_id :  id.id} )
                            .then(result => {

                                toast.success(result.data.msg);
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data.msg);
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    async updateAdminNftFeature(id, featured) {

        axios({
            method: 'post',
            url: `${config.apiUrl}addAdminNftFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {
                if (result.data.success === true) {
                    if (featured == 0) {
                        toast.success('Added in featured!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From featured!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.getAdminNFTAPI();
                }
            }).catch(err => {
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500
                }, setTimeout(() => {
                }, 500));
            })
    }

    async addOnSale(id, featured) {

        axios({
            method: 'post',
            url: `${config.apiUrl}addOnSale`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (featured == 0) {
                        toast.success('Added on sale!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From sale!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.userCollection();

                }
            }).catch(err => {
            })
    }

    async createNftConfirmAPI(nftData) {

        $('#mintId' + nftData.id).text('Processing...');
        $("#mintId" + nftData.id).prop("disabled", true);

        const token = this.token
        var localImage = './uploads/' + nftData.folder_name + '/' + nftData.local_image
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to mint?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}getLocalImageHash`,
                            headers: { authorization: token },
                            data: { "user_id": this.loginData?.id, 'email': this.loginData?.user_email, 'localImage': localImage }
                        }).then(response => {
                            if (response.data.success === true) {
                                nftData.ipfsHash = response.data.response
                                this.createNftAPI(nftData)
                            } else {
                                toast.error(response.data.msg,
                                );
                                $('#mintId' + nftData.id).text('Mint');
                                $("#mintId" + nftData.id).prop("disabled", false);
                            }
                        }).catch(err => {
                            // toast.error(err.response.data?.msg,
                            // );
                            $('#mintId' + nftData.id).text('Mint');
                            $("#mintId" + nftData.id).prop("disabled", false);
                        })

                },
                {
                    label: 'No',
                }
            ]
        });
    }
    addRow1 = (i) => {
        var rows = this.state.attributes
        rows.push({ 'type': '', 'value': '' })
        this.setState({ attributes: rows })
    }

    movePage() {
        window.location.href = `${config.baseUrl}adminnft`
    }

    modalShow(id) {
        if (id === 1) {
            this.setState({
                isSocial: 1,
                isPutonSale: 1,
                isTransferNft: 1
            })
        }
        else if (id === 0) {
            this.setState({
                isSocial: 0,
                isPutonSale: 0,
                isTransferNft: 0
            })
        }
    }


    async updateUserNftFeature(id, featured) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserNftFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {
                    if (featured == 0) {
                        toast.success('Added In Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.componentDidMount();

                }
            }).catch(err => {

                // toast.error(err.response.data?.msg, {
                //     position: toast.POSITION.TOP_CENTER, autoClose: 1500
                // }, setTimeout(() => {
                // }, 500));

            })
    }

    render() {

        return (
            <>
                <div className="wrapper theme-6-active pimary-color-green">

                    <Header />

                    <Leftsidebar />

                    <div className="right-sidebar-backdrop"></div>
                    <ToastContainer />

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Admin NFT's</h5>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Dialog
                                    className='create-popup'
                                        title={`You Created-${this.state.item_name}`}
                                        // icon="warning-sign"
                                        style={{
                                            color: '#3fa1f3',
                                            textAlign: "center",
                                           
                                        }}
                                        isOpen={this.state.isDialogOpen}
                                        isCloseButtonShown={false}
                                    >
                                        <div className="text-center pl-3 pr-3" style={{backgroundColor:"#fff"}}>
                                            {/* <BarLoader color="#e84747" height="2" /> */}
                                            <br />
                                            <h4 style={{ color: '#3fa1f3', fontSize: '16px',marginBottom:"15px"}}>To get set up for selling on marketplace, please put the item on sale</h4>
                                            {/* <p style={{ color: '#091f3f' }}>
              Please do not refresh page or close tab.
            </p> */}
                                            <div className='mb-3'>
                                                <img src={`${this.state.image_preview}`} className="create-img" />
                                            </div>
                                            <button type='button' style={{padding:"7px 35px"}} className='btn btn-primary' onClick={this.movePage.bind(this)}>Ok</button>
                                            {/* <div>
              <div class="spinner-border"></div>
            </div> */}
                                        </div>
                                    </Dialog>


                                    <Dialog
                                        title="Please Wait..."
                                        // icon="warning-sign"
                                        style={{
                                            color: '#3fa1f3',
                                            textAlign: "center"
                                        }}
                                        isOpen={this.state.isDialogOpen1}
                                        isCloseButtonShown={false}
                                    >
                                        <div className="text-center pl-3 pr-3">
                                            {/* <BarLoader color="#e84747" height="2" /> */}
                                            <br />
                                            <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}>To get set up for selling on Bline, you must approve this item for sale and listing.</h4>
                                            <p style={{ color: '#091f3f' }}>
                                                Please do not refresh page or close tab.
                                            </p>
                                            <div>
                                                <img src='img/loading.gif' style={{ width: '50px' }} />
                                            </div>
                                        </div>
                                    </Dialog>

                                    <Dialog
                                        title="Please Wait..."
                                        // icon="warning-sign"
                                        style={{
                                            color: '#3fa1f3',
                                            textAlign: "center"
                                        }}
                                        isOpen={this.state.isDialogOpenBid}
                                        isCloseButtonShown={false}
                                    >
                                        <div className="text-center">
                                            {/* <BarLoader color="#e84747" height="2" /> */}
                                            <br />
                                            <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}> Bid accepting in progress, Please wait for a while.</h4>
                                            <p style={{ color: '#091f3f' }}>
                                                Please do not refresh page or close tab.
                                            </p>
                                            <div>
                                                <img src='img/loading.gif' style={{ width: '50px' }} />
                                            </div>
                                        </div>
                                    </Dialog>

                                </div>



                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">

                                                <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add NFTs </button>
                                                <br />
                                                <br />

                                                <div className="form-wrap">
                                                    <div class="table-responsive">

                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.item_list1}
                                                            columns={this.columns}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add NFT</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name" value={this.state.item_name} maxLength="45" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description" value={this.state.description} maxLength="300" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Image(jpg, jpeg, png, gif)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Owner</label>
                                                                <input type="text" onChange={this.handleChange1} name="owner" className="form-control" placeholder="Owner Name" value={this.state.owner} />
                                                            </div>
                                                        </div> */}
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Games Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control basic">
                                                                        <option selected="selected" value="">Select Games Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Games</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_subcategory_id" onChange={this.handleChange1} value={this.state.item_subcategory_id} class="form-control basic">
                                                                        <option selected="selected" value="">Select Games</option>
                                                                        {this.state.SingleCategoryData.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Add Collection</label>
                                                                <div className="customSelectHolder">
                                                                    <select onChange={this.handleChange1} name='user_collection_id' className="form-control" >
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.admin_collection_list.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>



                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} value={this.state.sell_type} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Price</option>
                                                                        <option value="2">Auction</option>


                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Price(In Crypto)</label>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">royaltie</label>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange1} name="royaltie" className="form-control" placeholder="Royaltie" value={this.state.royaltie} />
                                                            </div>
                                                        </div>


                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Blockchain Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="blockchainType" onChange={this.handleChange1} value={this.state.blockchainType} >
                                                                        <option selected="selected" value="">Select Options</option>
                                                                        <option value="1">Ethereum</option>
                                                                        <option value="2">ETH</option>
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div> */}

                                                        {this.state.sell_type === '2' ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.handleChange1} min={this.state.currentDate} id="txt-appoint_date" onkeydown="return false" className="form-control" name="start_date" value={this.state.start_date} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Expiry Date</label>
                                                                        <input type="date" min={this.state.currentDate} onChange={this.handleChange1} className="form-control" name="expiry_date" value={this.state.expiry_date} />
                                                                    </div>
                                                                </div>

                                                            </>
                                                            : ''
                                                        }

                                                    </div>

                                                    <div className="form-actions">
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" onClick={e => this.closeModal(e)} data-dismiss="modal">Close</button>

                                            {this.state.spinLoader == 0 ?
                                                <button type='submit' onClick={this.API.bind(this)} className="btn btn-primary">Add </button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Update NFT</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Games Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Games Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (In Crypto)</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div> */}

                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Collection</label>
                                                                <div className="customSelectHolder">

                                                                    <select onChange={this.handleChange1} name='user_collection_id' value={this.state.user_collection_id} className="form-control" >
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.admin_collection_list.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Trending Status</label>
                                                                <div className="customSelectHolder">

                                                                    <select onChange={this.handleChange1} name='is_featured' value={this.state.is_featured} className="form-control" >
                                                                        <option value="1">Yes</option>
                                                                        <option value="0">No</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell / Not on sell</label>
                                                                <div className="customSelectHolder">

                                                                    <select onChange={this.handleChange1} name='is_on_sale' value={this.state.is_on_sale} className="form-control" >
                                                                        <option value="1">Yes</option>
                                                                        <option value="0">No</option>

                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-actions">
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {this.state.loader === '' ?
                                                <button type='submit' onClick={this.updateItemData} className="btn btn-primary">Update</button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-25px' }}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-striped mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>UserName</th>
                                                        <th>Profile Pic</th>
                                                        <th>Item Name</th>
                                                        <th>Bid Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {this.state.bid_list.length === 0 ?
                                                        <tr >
                                                            <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                                        this.state.bid_list.map(item => (
                                                            <tr>

                                                                <td> {item.user_name == null || item.user_name === '' || item.user_name === undefined
                                                                    ?
                                                                    <a style={{ cursor: 'pointer' }} onClick={e => window.open(`https:/ropsten.etherscan.io/address/${item.address}`)} target="_blank" >
                                                                        <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                                                    </a>

                                                                    :
                                                                    item.user_name}   </td>
                                                                <td >
                                                                    {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                        ?
                                                                        <img src='images/noimage.png' className="product-img" />
                                                                        :
                                                                        <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}
                                                                </td>
                                                                <td>{item.item_name}</td>
                                                                <td>{item.bid_price}</td>
                                                                <td><button type='submit' onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary">Accept</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="modal-footer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Footer />
                    </div>
                </div>

                <div className={this.state.isPutonSale === 0 ? "modal fade" : "modal fade show"} id="putOnSale" style={{ display: this.state.isPutonSale === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog" role="document">

                        <div className="modal-content create-popup">
                        
                            <div className="modal-header">
                            <a type="button" className="close" data-dismiss="modal" style={{
                                    fontSize: '26px'
                                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                                    <span aria-hidden="true">&times;</span>
                                </a>
                                <img src='images/sale.png'className='sale-icon'/>
                                <h5 className="modal-title" id="exampleModalLabel"> Put On Sale </h5>
                               
                            </div>

                            <div className="modal-body">
                                <div className="spacer-10" />
                                <div className="de_tab tab_methods">
                                    <div className="de_tab_content">
                                        {console.log(this.state.nftData)}
                                        {this.state.nftData?.sell_type === 1 ?
                                            <>
                                                <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                                                <h5>NFT Type : Price</h5>
                                                <label>Price</label>
                                                <input type="text" disabled value={this.state.nftData?.price} name="price" id="item_price_bid" className="fill" placeholder="Enter Price" />
                                            </>
                                            :
                                            this.state.nftData?.sell_type === 2 ?
                                                <>
                                                    <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                                                    <h5>NFT Type : Auction</h5>
                                                    <h5>Minimum bid</h5>
                                                    <input type="text" name="minimum_bid_amount" disabled value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                                                    <div className="spacer-10" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h5>Starting date</h5>
                                                            <DatePicker className="form-control" name="start_date" disabled value={this.state.nftData?.start_date1 ? this.state.nftData?.start_date1 : ''} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h5>Expiration date</h5>
                                                            <DatePicker className="form-control" name="expiry_date" minDate={this.state.endDate} disabled value={this.state.nftData?.expiry_date1 ? this.state.nftData?.expiry_date1 : ''} />

                                                        </div>
                                                        <div className="spacer-single" />
                                                    </div>
                                                </>
                                                :

                                                ""
                                        }
                                    </div>
                                </div>
                                <div className="spacer-10" />
                                <br />
                                {this.state.spinLoader === 0 ?
                                    <input type="submit" onClick={this.approveNFT.bind(this, this.state.nftData)} value="Approve" id="submit" className="btn-primary" defaultValue="Create Item" style={{display:"flex",margin:"auto"}}/>
                                    :
                                    <button disabled className="btn-main" id="deposit-page" >Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                }
                                <div className="spacer-single" />
                            </div>
                        </div>

                    </div>
                </div>
            </>


        )

    }
}