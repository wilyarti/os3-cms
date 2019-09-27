import React, {Component} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import FeatherIcon from 'feather-icons-react';
import {Editor} from '@tinymce/tinymce-react';
import {Settings, BarChart2, Info, Sliders, TrendingUp, TrendingDown, Activity} from 'react-feather';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postIsLoading: false,
            pageIsLoading: false,
            selectedPageIcon: "camera",
            selectedPostIcon: "camera",
            pageList: [],
            postList: [],
            pageID: '',
            postContents: '',
            pageName: "Please enter a name...",
            postName: "Please enter a name...",
            selectedPageIDTBD: '',
            selectedPostIDTBD: ''
        };
        this.addPage = this.addPage.bind(this);
        this.addPost = this.addPost.bind(this);
        this.createPage = this.createPage.bind(this);
        this.selectPageIcon = this.selectPageIcon.bind(this);
        this.selectPostIcon = this.selectPostIcon.bind(this);
        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.handlePostNameChange = this.handlePostNameChange.bind(this);
        this.handlePageID = this.handlePageID.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getPages = this.getPages.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.handlePageIDTBD = this.handlePageIDTBD.bind(this);
        this.handlePostIDTBD = this.handlePostIDTBD.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    handlePageIDTBD(e) {
        this.setState({selectedPageIDTBD: e.target.value})
    }

    handlePostIDTBD(e) {
        this.setState({selectedPostIDTBD: e.target.value})
    }

    handleEditorChange(content, editor) {
        this.setState({postContents: content})
    }

    handlePageNameChange(e) {
        this.setState({pageName: e.target.value})
    }

    handlePostNameChange(e) {
        this.setState({postName: e.target.value})
    }

    handlePageID(e) {
        console.log(e.target.value);
        this.setState({pageID: e.target.value});
    }

    selectPageIcon(icon) {
        this.setState({selectedPageIcon: icon.target.value})
    }

    selectPostIcon(icon) {
        this.setState({selectedPostIcon: icon.target.value})
    }

    createPage() {

    }

    // get pages list from server
    getPages() {
        this.setState({pageIsLoading: true});
        fetch("/api/getPages").then(response => response.json())
            .then((data) => {
                console.log(data);
                this.setState({pageList: data});
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.setState({pageIsLoading: false}) // set our page id so drop down works
                if (this.state.pageList.length > 0) {
                    this.setState({
                        pageIsLoading: false,
                        pageID: this.state.pageList[0].id,
                        selectedPageIDTBD: this.state.pageList[0].id
                    }) // set our page id so drop down works
                }
            });
    }

    // get post list from server
    getPosts() {
        this.setState({postIsLoading: true});
        fetch("/api/getPosts").then(response => response.json())
            .then((data) => {
                console.log(data);
                this.setState({postList: data});
            })
            .catch((error) => {
                alert(`${error} retrieving posts failed.`)
            })
            .finally((data) => {
                this.setState({postIsLoading: false});
                if (this.state.postList.length > 0) {
                    this.setState({
                        postIsLoading: false,
                        postID: this.state.postList[0].id,
                        selectedPostIDTBD: this.state.postList[0].id
                    }) // set our page id so drop down works
                }
            })
    }

    loadData() {
        this.setState({pageIsLoading: true});
        fetch("/api/getAllPostsAndPages").then(response => response.json())
            .then((data) => {
                console.log(data)
                this.setState({pageList: data})
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.setState({
                    pageIsLoading: false, pageID: this.state.pageList[0].id, selectedPageIDTBD: '',
                    selectedPostIDTBD: ''
                })
            })
    }

    addPage() {
        this.setState({pageIsLoading: true});
        var data = {
            name: this.state.pageName,
            icon: this.state.selectedPageIcon,
            createdTime: new Date()
        };
        fetch("/api/addPage",
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to add page." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.setState({pageIsLoading: false});
                this.getPages();
            })
    }

    addPost() {
        this.setState({postIsLoading: true});
        var data = {
            name: this.state.postName,
            pageID: this.state.pageID,
            icon: this.state.selectedPostIcon,
            createdTime: new Date(),
            contents: this.state.postContents
        };
        fetch("/api/addPost",
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to add post." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.setState({postIsLoading: false});
                this.getPosts();
            })
    }

    deletePage() {
        console.log(this.state)
        this.setState({pageIsLoading: true});
        console.log(`Page ID: ${this.state.pageID}`);
        var data = {
            id: this.state.selectedPageIDTBD,
        };
        fetch("/api/deletePage",
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to delete page." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.getPages();
            })
    }

    deletePost() {
        this.setState({postIsLoading: true});
        console.log(`Post ID: ${this.state.postID}`);
        var data = {
            id: this.state.selectedPostIDTBD,
        };
        fetch("/api/deletePost",
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to add post." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.getPosts();
            })
    }

    componentWillMount() {
        this.getPosts(); // load our post and page list on load
        this.getPages();
        console.log(this.state);
    }

    render() {
        const ourPages = this.state.pageList;
        const ourPosts = this.state.postList;

        const pageListDropDownMenu = ourPages.map((_, index) => {
            return (
                <option
                    value={this.state.pageList[index].id}>[{this.state.pageList[index].id}] {this.state.pageList[index].name}</option>
            )
        });

        const postListDropDownMenu = ourPosts.map((_, index) => {
            return (
                <option
                    value={this.state.postList[index].id}>[{this.state.postList[index].id}] {this.state.postList[index].name}</option>
            );
        });

        return (
            <Container fluid={true}>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                </Navbar>
                <Row>
                    <Col m={12}>
                        <Card>
                            <Card.Header>Create/Edit Post</Card.Header>
                            <Card.Body>
                                <Editor
                                    value={this.state.postContents}
                                    onEditorChange={this.handleEditorChange}
                                    initialValue="<p>This is the initial content of the editor</p>"
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help'
                                    }}/>
                                <Form>
                                    <Form.Group controlId="postForm.Name">
                                        <Form.Label>Post Name</Form.Label>
                                        <Form.Control value={this.state.postName} onChange={this.handlePostNameChange}
                                                      type="name" placeholder="Example post name...."/>
                                    </Form.Group>
                                    <Form.Group controlId="PostForm.ParentID">
                                        <Form.Label>Parent Page ID</Form.Label>
                                        <Form.Control value={this.state.pageID} onChange={this.handlePageID}
                                                      as="select">
                                            {pageListDropDownMenu}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group onChange={this.selectPostIcon.bind(this)} controlId="PostForm.Icon">
                                        <Form.Label>Page Icon <FeatherIcon
                                            icon={this.state.selectedPostIcon}/></Form.Label>
                                        <Form.Control as="select">
                                            <option>activity</option>
                                            <option>airplay</option>
                                            <option>alert-circle</option>
                                            <option>alert-octagon</option>
                                            <option>alert-triangle</option>
                                            <option>align-center</option>
                                            <option>align-justify</option>
                                            <option>align-left</option>
                                            <option>align-right</option>
                                            <option>anchor</option>
                                            <option>aperture</option>
                                            <option>archive</option>
                                            <option>arrow-down-circle</option>
                                            <option>arrow-down-left</option>
                                            <option>arrow-down-right</option>
                                            <option>arrow-down</option>
                                            <option>arrow-left-circle</option>
                                            <option>arrow-left</option>
                                            <option>arrow-right-circle</option>
                                            <option>arrow-right</option>
                                            <option>arrow-up-circle</option>
                                            <option>arrow-up-left</option>
                                            <option>arrow-up-right</option>
                                            <option>arrow-up</option>
                                            <option>at-sign</option>
                                            <option>award</option>
                                            <option>bar-chart-2</option>
                                            <option>bar-chart</option>
                                            <option>battery-charging</option>
                                            <option>battery</option>
                                            <option>bell-off</option>
                                            <option>bell</option>
                                            <option>bluetooth</option>
                                            <option>bold</option>
                                            <option>book-open</option>
                                            <option>book</option>
                                            <option>bookmark</option>
                                            <option>box</option>
                                            <option>briefcase</option>
                                            <option>calendar</option>
                                            <option>camera-off</option>
                                            <option>camera</option>
                                            <option>cast</option>
                                            <option>check-circle</option>
                                            <option>check-square</option>
                                            <option>check</option>
                                            <option>chevron-down</option>
                                            <option>chevron-left</option>
                                            <option>chevron-right</option>
                                            <option>chevron-up</option>
                                            <option>chevrons-down</option>
                                            <option>chevrons-left</option>
                                            <option>chevrons-right</option>
                                            <option>chevrons-up</option>
                                            <option>chrome</option>
                                            <option>circle</option>
                                            <option>clipboard</option>
                                            <option>clock</option>
                                            <option>cloud-drizzle</option>
                                            <option>cloud-lightning</option>
                                            <option>cloud-off</option>
                                            <option>cloud-rain</option>
                                            <option>cloud-snow</option>
                                            <option>cloud</option>
                                            <option>code</option>
                                            <option>codepen</option>
                                            <option>codesandbox</option>
                                            <option>coffee</option>
                                            <option>columns</option>
                                            <option>command</option>
                                            <option>compass</option>
                                            <option>copy</option>
                                            <option>corner-down-left</option>
                                            <option>corner-down-right</option>
                                            <option>corner-left-down</option>
                                            <option>corner-left-up</option>
                                            <option>corner-right-down</option>
                                            <option>corner-right-up</option>
                                            <option>corner-up-left</option>
                                            <option>corner-up-right</option>
                                            <option>cpu</option>
                                            <option>credit-card</option>
                                            <option>crop</option>
                                            <option>crosshair</option>
                                            <option>database</option>
                                            <option>delete</option>
                                            <option>disc</option>
                                            <option>dollar-sign</option>
                                            <option>download-cloud</option>
                                            <option>download</option>
                                            <option>droplet</option>
                                            <option>edit-2</option>
                                            <option>edit-3</option>
                                            <option>edit</option>
                                            <option>external-link</option>
                                            <option>eye-off</option>
                                            <option>eye</option>
                                            <option>facebook</option>
                                            <option>fast-forward</option>
                                            <option>feather</option>
                                            <option>figma</option>
                                            <option>file-minus</option>
                                            <option>file-plus</option>
                                            <option>file-text</option>
                                            <option>file</option>
                                            <option>film</option>
                                            <option>filter</option>
                                            <option>flag</option>
                                            <option>folder-minus</option>
                                            <option>folder-plus</option>
                                            <option>folder</option>
                                            <option>framer</option>
                                            <option>frown</option>
                                            <option>gift</option>
                                            <option>git-branch</option>
                                            <option>git-commit</option>
                                            <option>git-merge</option>
                                            <option>git-pull-request</option>
                                            <option>github</option>
                                            <option>gitlab</option>
                                            <option>globe</option>
                                            <option>grid</option>
                                            <option>hard-drive</option>
                                            <option>hash</option>
                                            <option>headphones</option>
                                            <option>heart</option>
                                            <option>help-circle</option>
                                            <option>hexagon</option>
                                            <option>home</option>
                                            <option>image</option>
                                            <option>inbox</option>
                                            <option>info</option>
                                            <option>instagram</option>
                                            <option>italic</option>
                                            <option>key</option>
                                            <option>layers</option>
                                            <option>layout</option>
                                            <option>life-buoy</option>
                                            <option>link-2</option>
                                            <option>link</option>
                                            <option>linkedin</option>
                                            <option>list</option>
                                            <option>loader</option>
                                            <option>lock</option>
                                            <option>log-in</option>
                                            <option>log-out</option>
                                            <option>mail</option>
                                            <option>map-pin</option>
                                            <option>map</option>
                                            <option>maximize-2</option>
                                            <option>maximize</option>
                                            <option>meh</option>
                                            <option>menu</option>
                                            <option>message-circle</option>
                                            <option>message-square</option>
                                            <option>mic-off</option>
                                            <option>mic</option>
                                            <option>minimize-2</option>
                                            <option>minimize</option>
                                            <option>minus-circle</option>
                                            <option>minus-square</option>
                                            <option>minus</option>
                                            <option>monitor</option>
                                            <option>moon</option>
                                            <option>more-horizontal</option>
                                            <option>more-vertical</option>
                                            <option>mouse-pointer</option>
                                            <option>move</option>
                                            <option>music</option>
                                            <option>navigation-2</option>
                                            <option>navigation</option>
                                            <option>octagon</option>
                                            <option>package</option>
                                            <option>paperclip</option>
                                            <option>pause-circle</option>
                                            <option>pause</option>
                                            <option>pen-tool</option>
                                            <option>percent</option>
                                            <option>phone-call</option>
                                            <option>phone-forwarded</option>
                                            <option>phone-incoming</option>
                                            <option>phone-missed</option>
                                            <option>phone-off</option>
                                            <option>phone-outgoing</option>
                                            <option>phone</option>
                                            <option>pie-chart</option>
                                            <option>play-circle</option>
                                            <option>play</option>
                                            <option>plus-circle</option>
                                            <option>plus-square</option>
                                            <option>plus</option>
                                            <option>pocket</option>
                                            <option>power</option>
                                            <option>printer</option>
                                            <option>radio</option>
                                            <option>refresh-ccw</option>
                                            <option>refresh-cw</option>
                                            <option>repeat</option>
                                            <option>rewind</option>
                                            <option>rotate-ccw</option>
                                            <option>rotate-cw</option>
                                            <option>rss</option>
                                            <option>save</option>
                                            <option>scissors</option>
                                            <option>search</option>
                                            <option>send</option>
                                            <option>server</option>
                                            <option>settings</option>
                                            <option>share-2</option>
                                            <option>share</option>
                                            <option>shield-off</option>
                                            <option>shield</option>
                                            <option>shopping-bag</option>
                                            <option>shopping-cart</option>
                                            <option>shuffle</option>
                                            <option>sidebar</option>
                                            <option>skip-back</option>
                                            <option>skip-forward</option>
                                            <option>slack</option>
                                            <option>slash</option>
                                            <option>sliders</option>
                                            <option>smartphone</option>
                                            <option>smile</option>
                                            <option>speaker</option>
                                            <option>square</option>
                                            <option>star</option>
                                            <option>stop-circle</option>
                                            <option>sun</option>
                                            <option>sunrise</option>
                                            <option>sunset</option>
                                            <option>tablet</option>
                                            <option>tag</option>
                                            <option>target</option>
                                            <option>terminal</option>
                                            <option>thermometer</option>
                                            <option>thumbs-down</option>
                                            <option>thumbs-up</option>
                                            <option>toggle-left</option>
                                            <option>toggle-right</option>
                                            <option>tool</option>
                                            <option>trash-2</option>
                                            <option>trash</option>
                                            <option>trello</option>
                                            <option>trending-down</option>
                                            <option>trending-up</option>
                                            <option>triangle</option>
                                            <option>truck</option>
                                            <option>tv</option>
                                            <option>twitch</option>
                                            <option>twitter</option>
                                            <option>type</option>
                                            <option>umbrella</option>
                                            <option>underline</option>
                                            <option>unlock</option>
                                            <option>upload-cloud</option>
                                            <option>upload</option>
                                            <option>user-check</option>
                                            <option>user-minus</option>
                                            <option>user-plus</option>
                                            <option>user-x</option>
                                            <option>user</option>
                                            <option>users</option>
                                            <option>video-off</option>
                                            <option>video</option>
                                            <option>voicemail</option>
                                            <option>volume-1</option>
                                            <option>volume-2</option>
                                            <option>volume-x</option>
                                            <option>volume</option>
                                            <option>watch</option>
                                            <option>wifi-off</option>
                                            <option>wifi</option>
                                            <option>wind</option>
                                            <option>x-circle</option>
                                            <option>x-octagon</option>
                                            <option>x-square</option>
                                            <option>x</option>
                                            <option>youtube</option>
                                            <option>zap-off</option>
                                            <option>zap</option>
                                            <option>zoom-in</option>
                                            <option>zoom-out</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                                <Button variant={'primary'}
                                        disabled={(this.state.postIsLoading)}
                                        onClick={!(this.state.postIsLoading) ? this.addPost : null}>
                                    {(this.state.postIsLoading) ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : ''}
                                    {'Add Post'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col m={6}>
                        <Card>
                            <Card.Header>Create/Edit Page</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                </Card.Text>
                                <Form>
                                    <Form.Group controlId="pageForm.Name">
                                        <Form.Label>Post Name</Form.Label>
                                        <Form.Control value={this.state.pageName} onChange={this.handlePageNameChange}
                                                      type="name" placeholder="Example post name...."/>
                                    </Form.Group>
                                    <Form.Group controlId="pageForm.ParentID">
                                        <Form.Label>Parent Page ID</Form.Label>
                                        <Form.Control as="select">
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group onChange={this.selectPageIcon.bind(this)} controlId="PostForm.Icon">
                                        <Form.Label>Page Icon <FeatherIcon
                                            icon={this.state.selectedPageIcon}/></Form.Label>
                                        <Form.Control as="select">
                                            <option>activity</option>
                                            <option>airplay</option>
                                            <option>alert-circle</option>
                                            <option>alert-octagon</option>
                                            <option>alert-triangle</option>
                                            <option>align-center</option>
                                            <option>align-justify</option>
                                            <option>align-left</option>
                                            <option>align-right</option>
                                            <option>anchor</option>
                                            <option>aperture</option>
                                            <option>archive</option>
                                            <option>arrow-down-circle</option>
                                            <option>arrow-down-left</option>
                                            <option>arrow-down-right</option>
                                            <option>arrow-down</option>
                                            <option>arrow-left-circle</option>
                                            <option>arrow-left</option>
                                            <option>arrow-right-circle</option>
                                            <option>arrow-right</option>
                                            <option>arrow-up-circle</option>
                                            <option>arrow-up-left</option>
                                            <option>arrow-up-right</option>
                                            <option>arrow-up</option>
                                            <option>at-sign</option>
                                            <option>award</option>
                                            <option>bar-chart-2</option>
                                            <option>bar-chart</option>
                                            <option>battery-charging</option>
                                            <option>battery</option>
                                            <option>bell-off</option>
                                            <option>bell</option>
                                            <option>bluetooth</option>
                                            <option>bold</option>
                                            <option>book-open</option>
                                            <option>book</option>
                                            <option>bookmark</option>
                                            <option>box</option>
                                            <option>briefcase</option>
                                            <option>calendar</option>
                                            <option>camera-off</option>
                                            <option>camera</option>
                                            <option>cast</option>
                                            <option>check-circle</option>
                                            <option>check-square</option>
                                            <option>check</option>
                                            <option>chevron-down</option>
                                            <option>chevron-left</option>
                                            <option>chevron-right</option>
                                            <option>chevron-up</option>
                                            <option>chevrons-down</option>
                                            <option>chevrons-left</option>
                                            <option>chevrons-right</option>
                                            <option>chevrons-up</option>
                                            <option>chrome</option>
                                            <option>circle</option>
                                            <option>clipboard</option>
                                            <option>clock</option>
                                            <option>cloud-drizzle</option>
                                            <option>cloud-lightning</option>
                                            <option>cloud-off</option>
                                            <option>cloud-rain</option>
                                            <option>cloud-snow</option>
                                            <option>cloud</option>
                                            <option>code</option>
                                            <option>codepen</option>
                                            <option>codesandbox</option>
                                            <option>coffee</option>
                                            <option>columns</option>
                                            <option>command</option>
                                            <option>compass</option>
                                            <option>copy</option>
                                            <option>corner-down-left</option>
                                            <option>corner-down-right</option>
                                            <option>corner-left-down</option>
                                            <option>corner-left-up</option>
                                            <option>corner-right-down</option>
                                            <option>corner-right-up</option>
                                            <option>corner-up-left</option>
                                            <option>corner-up-right</option>
                                            <option>cpu</option>
                                            <option>credit-card</option>
                                            <option>crop</option>
                                            <option>crosshair</option>
                                            <option>database</option>
                                            <option>delete</option>
                                            <option>disc</option>
                                            <option>dollar-sign</option>
                                            <option>download-cloud</option>
                                            <option>download</option>
                                            <option>droplet</option>
                                            <option>edit-2</option>
                                            <option>edit-3</option>
                                            <option>edit</option>
                                            <option>external-link</option>
                                            <option>eye-off</option>
                                            <option>eye</option>
                                            <option>facebook</option>
                                            <option>fast-forward</option>
                                            <option>feather</option>
                                            <option>figma</option>
                                            <option>file-minus</option>
                                            <option>file-plus</option>
                                            <option>file-text</option>
                                            <option>file</option>
                                            <option>film</option>
                                            <option>filter</option>
                                            <option>flag</option>
                                            <option>folder-minus</option>
                                            <option>folder-plus</option>
                                            <option>folder</option>
                                            <option>framer</option>
                                            <option>frown</option>
                                            <option>gift</option>
                                            <option>git-branch</option>
                                            <option>git-commit</option>
                                            <option>git-merge</option>
                                            <option>git-pull-request</option>
                                            <option>github</option>
                                            <option>gitlab</option>
                                            <option>globe</option>
                                            <option>grid</option>
                                            <option>hard-drive</option>
                                            <option>hash</option>
                                            <option>headphones</option>
                                            <option>heart</option>
                                            <option>help-circle</option>
                                            <option>hexagon</option>
                                            <option>home</option>
                                            <option>image</option>
                                            <option>inbox</option>
                                            <option>info</option>
                                            <option>instagram</option>
                                            <option>italic</option>
                                            <option>key</option>
                                            <option>layers</option>
                                            <option>layout</option>
                                            <option>life-buoy</option>
                                            <option>link-2</option>
                                            <option>link</option>
                                            <option>linkedin</option>
                                            <option>list</option>
                                            <option>loader</option>
                                            <option>lock</option>
                                            <option>log-in</option>
                                            <option>log-out</option>
                                            <option>mail</option>
                                            <option>map-pin</option>
                                            <option>map</option>
                                            <option>maximize-2</option>
                                            <option>maximize</option>
                                            <option>meh</option>
                                            <option>menu</option>
                                            <option>message-circle</option>
                                            <option>message-square</option>
                                            <option>mic-off</option>
                                            <option>mic</option>
                                            <option>minimize-2</option>
                                            <option>minimize</option>
                                            <option>minus-circle</option>
                                            <option>minus-square</option>
                                            <option>minus</option>
                                            <option>monitor</option>
                                            <option>moon</option>
                                            <option>more-horizontal</option>
                                            <option>more-vertical</option>
                                            <option>mouse-pointer</option>
                                            <option>move</option>
                                            <option>music</option>
                                            <option>navigation-2</option>
                                            <option>navigation</option>
                                            <option>octagon</option>
                                            <option>package</option>
                                            <option>paperclip</option>
                                            <option>pause-circle</option>
                                            <option>pause</option>
                                            <option>pen-tool</option>
                                            <option>percent</option>
                                            <option>phone-call</option>
                                            <option>phone-forwarded</option>
                                            <option>phone-incoming</option>
                                            <option>phone-missed</option>
                                            <option>phone-off</option>
                                            <option>phone-outgoing</option>
                                            <option>phone</option>
                                            <option>pie-chart</option>
                                            <option>play-circle</option>
                                            <option>play</option>
                                            <option>plus-circle</option>
                                            <option>plus-square</option>
                                            <option>plus</option>
                                            <option>pocket</option>
                                            <option>power</option>
                                            <option>printer</option>
                                            <option>radio</option>
                                            <option>refresh-ccw</option>
                                            <option>refresh-cw</option>
                                            <option>repeat</option>
                                            <option>rewind</option>
                                            <option>rotate-ccw</option>
                                            <option>rotate-cw</option>
                                            <option>rss</option>
                                            <option>save</option>
                                            <option>scissors</option>
                                            <option>search</option>
                                            <option>send</option>
                                            <option>server</option>
                                            <option>settings</option>
                                            <option>share-2</option>
                                            <option>share</option>
                                            <option>shield-off</option>
                                            <option>shield</option>
                                            <option>shopping-bag</option>
                                            <option>shopping-cart</option>
                                            <option>shuffle</option>
                                            <option>sidebar</option>
                                            <option>skip-back</option>
                                            <option>skip-forward</option>
                                            <option>slack</option>
                                            <option>slash</option>
                                            <option>sliders</option>
                                            <option>smartphone</option>
                                            <option>smile</option>
                                            <option>speaker</option>
                                            <option>square</option>
                                            <option>star</option>
                                            <option>stop-circle</option>
                                            <option>sun</option>
                                            <option>sunrise</option>
                                            <option>sunset</option>
                                            <option>tablet</option>
                                            <option>tag</option>
                                            <option>target</option>
                                            <option>terminal</option>
                                            <option>thermometer</option>
                                            <option>thumbs-down</option>
                                            <option>thumbs-up</option>
                                            <option>toggle-left</option>
                                            <option>toggle-right</option>
                                            <option>tool</option>
                                            <option>trash-2</option>
                                            <option>trash</option>
                                            <option>trello</option>
                                            <option>trending-down</option>
                                            <option>trending-up</option>
                                            <option>triangle</option>
                                            <option>truck</option>
                                            <option>tv</option>
                                            <option>twitch</option>
                                            <option>twitter</option>
                                            <option>type</option>
                                            <option>umbrella</option>
                                            <option>underline</option>
                                            <option>unlock</option>
                                            <option>upload-cloud</option>
                                            <option>upload</option>
                                            <option>user-check</option>
                                            <option>user-minus</option>
                                            <option>user-plus</option>
                                            <option>user-x</option>
                                            <option>user</option>
                                            <option>users</option>
                                            <option>video-off</option>
                                            <option>video</option>
                                            <option>voicemail</option>
                                            <option>volume-1</option>
                                            <option>volume-2</option>
                                            <option>volume-x</option>
                                            <option>volume</option>
                                            <option>watch</option>
                                            <option>wifi-off</option>
                                            <option>wifi</option>
                                            <option>wind</option>
                                            <option>x-circle</option>
                                            <option>x-octagon</option>
                                            <option>x-square</option>
                                            <option>x</option>
                                            <option>youtube</option>
                                            <option>zap-off</option>
                                            <option>zap</option>
                                            <option>zoom-in</option>
                                            <option>zoom-out</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                                <Button variant={'primary'}
                                        disabled={(this.state.pageIsLoading)}
                                        onClick={!(this.state.pageIsLoading) ? this.addPage : null}>
                                    {(this.state.pageIsLoading) ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : ''}
                                    {'Add Page'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col m={6}>
                        <Card>
                            <Card.Header>Delete Post/Page</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                </Card.Text>
                                <Form>
                                    <Form.Group controlId="deleteForm.pageName">
                                        <Form.Label>Select Page</Form.Label>
                                        <Form.Control value={this.state.selectedPageIDTBD}
                                                      onChange={this.handlePageIDTBD} as="select">
                                            {pageListDropDownMenu}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant={'primary'}
                                            disabled={(this.state.pageIsLoading)}
                                            onClick={!(this.state.pageIsLoading) ? this.deletePage : null}>
                                        {(this.state.pageIsLoading) ? <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : ''}
                                        {'Delete Page'}
                                    </Button>
                                    <Form.Group controlId="deleteForm.postName">
                                        <Form.Label>Select Post</Form.Label>
                                        <Form.Control value={this.state.selectedPostIDTBD}
                                                      onChange={this.handlePostIDTBD} as="select">
                                            {postListDropDownMenu}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant={'primary'}
                                            disabled={(this.state.pageIsLoading)}
                                            onClick={!(this.state.pageIsLoading) ? this.deletePost : null}>
                                        {(this.state.pageIsLoading) ? <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : ''}
                                        {'Delete Post'}
                                    </Button>
                                </Form>
                                <br/>
                                <Button variant={'primary'}
                                        disabled={(this.state.pageIsLoading)}
                                        onClick={!(this.state.pageIsLoading) ? this.loadData : null}>
                                    {(this.state.pageIsLoading) ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : ''}
                                    {'Retrieve Page/Post List'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <br/>
            </Container>

        );
    }
}

export default App;
