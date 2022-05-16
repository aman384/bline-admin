import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
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
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';

export default class editNft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            user_collection_id: '',
            item_category_id: '',
            royalty_percent: '0',
            methodType: '1',
            sell_type: '1',
            price: '0',
            minimum_bid: '0',
            start_date: '',
            expiry_date: '',
            image_file: '',
            image_preview: '',
            categoryData: [],
            collectionData: [],
            spinLoader: '0',
            currentDate: '',
            endDate: '',
        }
        this.loginData = (!Cookies.get('loginSuccessSpotlyytAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessSpotlyytAdmin'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        this.updateNftAPI = this.updateNftAPI.bind(this)
        this.onChange = this.handleChange.bind(this);

        const { match: { params } } = this.props;
        this.id = params.id
    }

    componentDidMount() {

        var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var array = startDate.split(' ');
        if (array[0]) {
            this.setState({
                currentDate: array[0],
                endDate: array[0]
            })
        }
        
        this.getCategoryAPI()
        this.getUserCollectionAPI()
        this.getNftDetailsAPI()
    }

    async getNftDetailsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': this.id, 'user_id': '0' }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    nftData: response.data.response
                })
            }
        })
    }

    async getCategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    categoryData: response.data.response
                })
            }
        })
    }

    async getUserCollectionAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getAdminCollection`
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }

    nftimageChange = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        if (image_as_files.type.indexOf('image') === 0) {
            var file_type = 'image';
        } else {
            var file_type = 'video';
        }

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['file_type']: file_type }
        }))

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
            image_type: e.target.files[0].type,
            imageError: ""
        })
    }

    handleChange = e => {

        if (e.target.name == 'name') {
            this.setState({
                'nameError': ""
            })
        }

        if (e.target.name == 'description') {
            this.setState({
                'descError': ""
            })
        }

        if (e.target.name == 'user_collection_id') {
            this.setState({
                'collectionError': ""
            })
        }

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
        }

        if (e.target.name == 'start_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
            }))

            this.setState({
                endDate: e.target.value
            })

        }

        if (e.target.name == 'expiry_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['expiry_date1']: e.target.value }
            }))
        }

        if (e.target.name == 'minimum_bid_amount') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['price']: e.target.value }
            }))
        }

        // this.setState({
        //     [e.target.name]: e.target.value
        // })

        let value = e.target.value;
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, [e.target.name]: value }
        }))
    }

    sellType(type) {
        this.setState({
            'sell_type': type
        })

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['sell_type']: type }
        }))
    }

    validate = () => {
        let nameError = ""
        let descError = ""
        let imageError = ""
        let collectionError = ""
        let categoryError = ""

        if (this.state.nftData?.name === '') {
            nameError = "Title is required."
        }
        if (this.state.nftData?.description === '') {
            descError = "Description is required."
        }
        if (this.state.nftData?.user_collection_id === '0' || this.state.nftData?.user_collection_id === '') {
            collectionError = "Collection is required."
        }
        if (this.state.nftData?.item_category_id === '0' || this.state.nftData?.item_category_id == '') {
            categoryError = "Category is required."
        }
        if (this.state.nftData?.image_file === '') {
            imageError = "Image is required."
        }
        if (nameError || descError || imageError || collectionError || categoryError) {

            window.scrollTo(0, 220)

            this.setState({
                nameError, descError, categoryError, collectionError, imageError
            })
            return false
        }
        return true
    }


    handleChangeStartDate = e => {
        let startDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['start_date1']: startDate }
        }))
    }

    handleChangeEndDate = e => {
        let endDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['expiry_date1']: endDate }
        }))
    }

    formatDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }


    async metaDataUpload(file) {
        let resIPF = await axios({
            method: 'post',
            url: `${config.apiUrl}updateMetadata`,
            data: {
                "tokenid": this.state.nftData?.token_id,
                "name": this.state.nftData?.name,
                "description": this.state.nftData?.description,
                "image": `https://meme.mypinata.cloud/ipfs/${this.state.image_preview ? this.state.ImageFileHash : this.state.nftData?.image}`
            }
        });
        let status = resIPF.data.status;
        this.setState({
            token_id: status
        })
        return status;
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

    async updateNftAPI(e) {
        e.preventDefault();
        const isValid = this.validate()
        if (!isValid) {

        }
        else {
            this.setState({
                spinLoader: '1',
                isDialogOpen: true
            })

            let ImageFileHash = this.state.ImageFileHash;
            if (this.state.image_preview) {
                ImageFileHash = await this.imageUpload();
            } else {
                ImageFileHash = this.state.nftData?.image;
            }

            await this.metaDataUpload();

            let formData = new FormData();

            formData.append('price', this.state.nftData?.price);
            formData.append('item_id', this.state.nftData?.item_id);
            formData.append('image', ImageFileHash);
            formData.append('name', this.state.nftData?.name);
            formData.append('file_type', this.state.file_type ? this.state.file_type : this.state.nftData?.file_type);
            formData.append('royalty_percent', this.state.nftData?.royalty_percent);
            formData.append('description', this.state.nftData?.description);
            formData.append('start_date', this.state.nftData?.start_date1 && this.state.nftData?.start_date1 != '0000-00-00' ? this.formatDate(this.state.nftData?.start_date1) : '');
            formData.append('expiry_date', this.state.nftData?.expiry_date1 && this.state.nftData?.expiry_date1 != '0000-00-00' ? this.formatDate(this.state.nftData?.expiry_date1) : '');
            formData.append('item_category_id', this.state.nftData?.item_category_id);
            formData.append('user_collection_id', this.state.nftData?.user_collection_id);
            formData.append('sell_type', this.state.nftData?.sell_type);
            formData.append('user_id', this.loginData?.data?.id);
            formData.append('email', this.loginData?.data?.user_email);

            axios.post(`${config.apiUrl}updateNftByUser`, formData)
                .then(result => {

                    this.setState({
                        spinLoader: '0'
                    })

                    if (result.data.success === true) {
                        toast.success(result.data.msg, {

                        });
                        // setTimeout(() => {
                        //     window.location.href = `${config.baseUrl}adminnft`
                        // }, 2000);
                    } else {
                        toast.error(result.data.msg, {

                        });
                        this.setState({
                            spinLoader: '0'
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: '0'
                    })
                })
        }
    }

    render() {

        return (
            <>
                <Toaster />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Edit NFT</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-10">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">
                                                        <div className="row">
                                                        </div>
                                                        <div className="form-actions">

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">
                                                    <form id="form-create-item" className="form-border" method="post" action="email.php">
                                                        <div className="field-set">
                                                            <h5>Image</h5>
                                                            <div className="d-create-file">
                                                                {this.state.nftData?.file_type === 'image' ?
                                                                    this.state.image_preview === '' ?
                                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                                        :
                                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                                    :
                                                                    this.state.nftData?.file_type === 'video' ?
                                                                        this.state.image_preview != '' ?
                                                                            <Player style={{ height: '50px', width: '50px' }} id="image" className="" src={this.state.image_preview} />
                                                                            :
                                                                            <Player id="image" className="" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                                        : ""
                                                                }
                                                                <span className="error-asterick"> {this.state.imageError}</span>
                                                            </div>

                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Image(jpg, jpeg, png, gif)</label>
                                                                    <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={this.nftimageChange} />
                                                                </div>
                                                            </div>

                                                            <div className="spacer-single" />
                                                            <div className='form-group'>
                                                                <h5>Title</h5>
                                                                <input type="text" name="name" onChange={this.handleChange} id="item_title" value={this.state.nftData?.name} className="form-control" placeholder="e.g. 'Crypto Funk" />
                                                                <span className="error-asterick"> {this.state.nameError}</span>
                                                            </div>

                                                            <div className='form-group'>
                                                                <h5>Description</h5>
                                                                <textarea data-autoresize name="description" onChange={this.handleChange} id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" value={this.state.nftData?.description} ></textarea>
                                                                <span className="error-asterick"> {this.state.descError}</span>
                                                            </div>

                                                            <div className="collection-drop">
                                                                <div className='form-group'>
                                                                    <h5>Collection</h5>
                                                                    <select onChange={this.handleChange} value={this.state.nftData?.user_collection_id} className="form-control" name="user_collection_id">
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.collectionData.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    <span className="error-asterick"> {this.state.collectionError}</span>
                                                                </div>
                                                                <div className='form-group'>
                                                                    <h5>Categories</h5>
                                                                    <select onChange={this.handleChange} value={this.state.nftData?.item_category_id} className="form-control" name="item_category_id">
                                                                        <option value="">Select Category</option>
                                                                        {this.state.categoryData.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    <span className="error-asterick"> {this.state.categoryError}</span>
                                                                </div>
                                                            </div>
                                                            <div className='form-group'>
                                                                <h5>Royalties</h5>
                                                                <input onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} disabled={this.state.nftData?.is_minted == 1} type="text" value={this.state.nftData?.royalty_percent} onChange={this.handleChange} name="royalty_percent" id="item_royalties" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%. Maximum is 25%" />
                                                            </div>

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price{this.state.blockchainType == 1 ? '(ETH)' : this.state.blockchainType == 2 ? '(MATIC)' : ''}</label>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} value={this.state.nftData?.price} name="price" className="form-control" placeholder="Price" />
                                                            </div>

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange} value={this.state.nftData?.sell_type} >
                                                                        <option selected="selected" value="">Select Options</option>
                                                                        <option value="1">Price</option>
                                                                        <option value="2">Auction</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            {this.state.nftData?.sell_type == '2' ?
                                                                <>
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.handleChange} min={this.state.currentDate} className="form-control" name="start_date" value={this.state.nftData?.start_date1} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Expiry Date</label>
                                                                        <input type="date" min={this.state.currentDate} onChange={this.handleChange} className="form-control" name="expiry_date" value={this.state.nftData?.expiry_date1} />
                                                                    </div>

                                                                </>
                                                                : ''
                                                            }

                                                            <div className="spacer-10" />
                                                            {this.state.spinLoader === '0' ?
                                                                <input type="submit" onClick={this.updateNftAPI} value="Update" id="submit" className="btn-primary btn-sm" defaultValue="Create Item" />
                                                                :
                                                                <button disabled className="btn-primary" id="deposit-page" >Updating NFT &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                                            }
                                                            <div className="spacer-single" />
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}