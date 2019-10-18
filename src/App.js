import React, {Component} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import FeatherIcon from 'feather-icons-react';
import {Editor} from '@tinymce/tinymce-react';
import IconList from './icons'
import moment from "moment-timezone";

class App extends Component {
    errorMessage;

    constructor(props) {
        super(props);
        this.state = {
            // storage for arrays
            pageList: [],
            postList: [],
            userList: [],
            pageListLookup: {},
            postListLookup: {},
            userListLookup: {},
            // pages
            pageIsLoading: false,
            editPageBoolean: false,
            pageDisabledBoolean: false,
            selectedPageIDTBD: '',
            selectedPageIDTBE: '',
            page: {
                id: 0,
                disabled: false,
                name: 'Enter a name',
                icon: IconList[0],
                pageID: '',
                author: 'user',
                createdTime: new Date(),
                timeZone: moment.tz.guess(),
            },
            // posts
            postIsLoading: false,
            editPostBoolean: false,
            postDisabledBoolean: false,
            selectedPostIDTBD: '',
            selectedPostIDTBE: '',
            post: {
                id: 0,
                disabled: false,
                name: 'Please enter a name....',
                icon: IconList[0],
                pageID: '',
                author: 'user',
                createdTime: new Date(),
                timeZone: moment.tz.guess(),
                contents: ''
            },
            // users
            userIsLoading: false,
            userEditBoolean: false,
            userDisabledBoolean: false,
            selectedUserIDTBD: '',
            selectedUserIDTBE: '',
            user: {
                // NOT NULLABLE entries
                id: 0,
                disabled: false,
                createdTime: new Date(),
                group: 'user',
                password: 'password1234',
                username: 'exampleUser',
                // NULLABLE entries
                firstName: '',
                lastName: '',
                streetAddress: '',
                postCode: '',
                state: '',
                country: '',
                countryCode: '',
                language: 'ENGLISH',
                email: '',
                areaCode: '',
                mobile: '',
                secondaryGroup: 0,
                metadata: ''
            },
        };

        // pages
        this.addPage = this.addPage.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.getPages = this.getPages.bind(this);
        this.handleDisablePage = this.handleDisablePage.bind(this);
        this.handlePageEditMode = this.handlePageEditMode.bind(this);
        this.handlePageFormChange = this.handlePageFormChange.bind(this);
        this.handlePageIDTBD = this.handlePageIDTBD.bind(this);
        this.handlePageIDTBE = this.handlePageIDTBE.bind(this);

        // posts
        this.addPost = this.addPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.handleDisablePost = this.handleDisablePost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handlePostEditMode = this.handlePostEditMode.bind(this);
        this.handlePostFormChange = this.handlePostFormChange.bind(this);
        this.handlePostIDTBD = this.handlePostIDTBD.bind(this);
        this.handlePostIDTBE = this.handlePostIDTBE.bind(this);

        // users
        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.handleDisableUser = this.handleDisableUser.bind(this);
        this.handleUserEditMode = this.handleUserEditMode.bind(this);
        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.handleUserIDTBD = this.handleUserIDTBD.bind(this);
        this.handleUserIDTBE = this.handleUserIDTBE.bind(this);

        this.loadData = this.loadData.bind(this);
    }

    // pages
    handleDisablePage() {
        let page = this.state.page;
        page.disabled = !page.disabled;
        this.setState({page})
    }

    handlePageEditMode() {
        let page = this.state.pageList[0];
        if (typeof page !== "undefined" && this.state.editPageBoolean == false) {
            this.setState({
                page, selectedPageIDTBE: page.id
            })
        }
        this.setState({editPageBoolean: !this.state.editPageBoolean})
    }

    handlePageFormChange(e) {
        let page = this.state.page;
        page[e.target.name] = e.target.value;
        this.setState({page})
    }

    handlePageIDTBE(e) {
        const thisPageID = e.target.value;
        const page = this.state.pageListLookup[thisPageID];
        if (typeof page !== "undefined") {
            this.setState({
                page
            })
        }
        this.setState({selectedPageIDTBE: thisPageID})
    }

    //posts
    handleDisablePost() {
        let post = this.state.post;
        post.disabled = !post.disabled;
        this.setState({post})
    }

    handlePostEditMode() {
        let post = this.state.postList[0];
        if (typeof post !== "undefined" && this.state.editPostBoolean == false) {
            this.setState({
                post, selectedPostIDTBE: post.id
            })
        }
        this.setState({editPostBoolean: !this.state.editPostBoolean})
    }

    handlePostFormChange(e) {
        let post = this.state.post;
        post[e.target.name] = e.target.value;
        this.setState({post})
    }

    handleEditorChange(content, editor) {
        let post = this.state.post;
        post.contents = content
        this.setState({post});
    }

    handlePostIDTBE(e) {
        const thisPostID = e.target.value;
        const post = this.state.postListLookup[thisPostID];
        if (typeof post !== "undefined") {
            this.setState({
                post
            })
        }
        this.setState({selectedPostIDTBE: thisPostID})
    }

    // users
    handleDisableUser() {
        let user = this.state.user;
        user.disabled = !user.disabled;
        this.setState({user})
    }

    handleUserEditMode() {
        let user = this.state.userList[0];
        this.setState({editUserBoolean: !this.state.editUserBoolean, user})
    }

    handleUserFormChange(e) {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({user})
    }

    // Changes our form to edit users.
    handleUserIDTBE(e) {
        const thisUserID = e.target.value;
        const user = this.state.userListLookup[thisUserID];
        if (typeof user !== "undefined") {
            this.setState({
                user,
                userDisabledBoolean: user.disabled
            })
        }
        this.setState({selectedUserIDTBE: thisUserID});
    }

    handlePageIDTBD(e) {
        this.setState({selectedPageIDTBD: e.target.value})
    }

    handlePostIDTBD(e) {
        this.setState({selectedPostIDTBD: e.target.value})
    }

    handleUserIDTBD(e) {
        this.setState({selectedUserIDTBD: e.target.value})
    }

    handlePageID(e) {
        this.setState({pageID: e.target.value});
    }

    selectPageIcon(icon) {
        this.setState({selectedPageIcon: icon.target.value})
    }

    selectPostIcon(icon) {
        this.setState({selectedPostIcon: icon.target.value});
    }
    loadData() {
        this.getPosts();
        this.getPages();
        this.getUsers();
    }
    // get pages list from server
    getPages() {
        this.setState({pageIsLoading: true});
        fetch("/api/getPages").then(response => response.json())
            .then((data) => {
                if (data.success == false) {
                    alert(data.errorMessage);
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }
                this.setState({pageList: data, pageListLookup: lookup});
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                let post = this.state.post;
                post.pageID = this.state.pageList[0].id;
                this.setState({pageIsLoading: false, post}); // set our page id so drop down works
            });
    }

    // get post list from server
    getPosts() {
        this.setState({postIsLoading: true});
        fetch("/api/getPosts").then(response => response.json())
            .then((data) => {
                if (data.success == false) {
                    alert(data.errorMessage);
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }
                this.setState({postList: data, postListLookup: lookup});
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

    getUsers() {
        this.setState({userIsLoading: true});
        fetch("/api/getUsers").then(response => response.json())
            .then((data) => {
                if (data.success == false) {
                    alert(data.errorMessage);
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }
                this.setState({userList: data, userListLookup: lookup});
            })
            .catch((error) => {
                alert(`${error} retrieving users failed.`)
            })
            .finally((data) => {
                this.setState({userIsLoading: false});
                let selectedUserIDTBE = this.state.selectedUserIDTBE ? this.state.selectedUserIDTBE : this.state.userList[0].id;
                let userID = this.state.userID ? this.state.userID : this.state.userList[0].id;
                if (this.state.userList.length > 0) {
                    this.setState({
                        userID,
                        selectedUserIDTBE
                    }) // set our page id so drop down works
                }
            })
    }
    addPage() {
        if (this.state.editPageBoolean) {
            this.updatePage();
            return;
        }
        this.setState({pageIsLoading: true});
        ///TODO fill in empty fields
        let data = this.state.page;
        data.pageID = 0; //TODO implement sub pages...
        data.createdTime = new Date();
        data.timeZone = moment.tz.guess();
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

    addUser() {
        this.setState({userIsLoading: true});
        const editMode = this.state.editUserBoolean;
        let data = this.state.user;
        data.createdTime = new Date();
        data.timeZone = moment.tz.guess();
        let request = (editMode) ? "/api/updateUser" : "/api/addUser";
        fetch(request,
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to add user." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} adding user failed.`)
            })
            .finally((data) => {
                this.setState({userIsLoading: false}, () => this.getUsers());
            })
    }

    updatePage() {
        this.setState({pageIsLoading: true});
        let data = this.state.page;
        data.id = this.state.selectedPageIDTBE;
        fetch("/api/updatePage",
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to update page." + data.errorMessage)
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

    updatePost() {
        this.setState({postIsLoading: true});
        let data = this.state.post;
        data.id = this.state.selectedPostIDTBE;
        data.createdTime = new Date();
        data.timeZone = moment.tz.guess();
        fetch("/api/updatePost",
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to update post." + data.errorMessage)
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

    addPost() {
        if (this.state.editPostBoolean) {
            console.log("Updating post");
            this.updatePost();
            return;
        }
        console.log("Adding post");
        this.setState({postIsLoading: true});
        let data = this.state.post;
        data.createdTime = new Date();
        data.timeZone = moment.tz.guess();
        fetch("/api/addPost",
            {
                method: 'POST',
                body: JSON.stringify(data),
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
        this.setState({pageIsLoading: true});
        let data = {
            id: this.state.selectedPageIDTBD,
        };
        fetch("/api/deletePage",
            {
                method: 'POST',
                body: JSON.stringify(data),
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
        let data = {
            id: this.state.selectedPostIDTBD,
        };
        fetch("/api/deletePost",
            {
                method: 'POST',
                body: JSON.stringify(data),
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

    deleteUser() {
        this.setState({userIsLoading: true});
        let data = {
            id: this.state.selectedUserIDTBD,
            username: "On the chopping block."
        };
        fetch("/api/deleteUser",
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((data) => {
                if (data.success !== true) {
                    alert("Unable to delete user." + data.errorMessage)
                }
            })
            .catch((error) => {
                alert(`${error} retrieving pages failed.`)
            })
            .finally((data) => {
                this.getUsers();
            })
    }


    componentWillMount() {
        this.loadData();
    }

    render() {
        const ourPages = this.state.pageList;
        const ourPosts = this.state.postList;
        const ourUsers = this.state.userList;

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

        const userListDropDownMenu = ourUsers.map((_, index) => {
            return (
                <option
                    value={this.state.userList[index].id}>[{this.state.userList[index].id}] {this.state.userList[index].username}</option>
            );
        });

        const IconOptionList = IconList.map((_, index) => {
            return (
                <option key={index} value={IconList[index]}>{IconList[index]}</option>
            )
        });

        return (
            <Container fluid={true}>
                <Tabs
                    id="tabs"
                    activeKey={this.state.key}
                    size="sm"
                    onSelect={key => this.setState({key})}
                >
                    <Tab eventKey="editPost"
                         title={<FeatherIcon icon={"edit"}/>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            {this.state.editPostBoolean &&
                                            <Form.Group controlId="selectPostToEdit">
                                                <Form.Label>Select Post</Form.Label>
                                                <Form.Control
                                                    value={this.state.selectedPostIDTBE}
                                                    onChange={this.handlePostIDTBE} as="select">
                                                    {postListDropDownMenu}
                                                </Form.Control>
                                            </Form.Group>
                                            }
                                        </Form>
                                    </Col>
                                    <Col xs={12}>
                                        <Editor
                                            value={this.state.post.contents}
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="postForm.Edit">
                                                <Form.Label>Post Name</Form.Label>
                                                <Form.Control value={this.state.post.name} name="name"
                                                              onChange={this.handlePostFormChange}
                                                              type="name" placeholder="Example post name...."/>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col lg={4} xs={12}>
                                        <Form>

                                            <Form.Group controlId="PostForm.ParentID">
                                                <Form.Label>Parent Page ID</Form.Label>
                                                <Form.Control value={this.state.post.pageID} name="pageID"
                                                              onChange={this.handlePostFormChange}
                                                              as="select">
                                                    {pageListDropDownMenu}
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="PostForm.Icon">
                                                <Form.Label>Post Icon <FeatherIcon
                                                    icon={this.state.user.icon}/></Form.Label>
                                                <Form.Control onChange={this.handlePostFormChange} name="icon"
                                                              value={this.state.post.icon} as="select">
                                                    {IconOptionList}
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" label="Edit Mode"
                                                            value={this.state.editPostBoolean}
                                                            onChange={this.handlePostEditMode}>
                                                </Form.Check>
                                            </Form.Group>
                                        </Form>

                                        <Form.Check type="checkbox" label="Disable Post"
                                                    checked={this.state.post.disabled}
                                                    onChange={this.handleDisablePost}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
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
                                            {this.state.editPostBoolean ? 'Update' : 'Add Post'}
                                        </Button>
                                    </Col>
                                </Row>
                            </post-contents>
                        </post>
                    </Tab>
                    <Tab eventKey="Page"
                         title={<FeatherIcon icon={"file-plus"}/>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        {this.state.editPageBoolean &&
                                        <Form.Group controlId="pageid.pageName">
                                            <Form.Label>Select Page</Form.Label>
                                            <Form.Control
                                                value={this.state.selectedPageIDTBE}
                                                onChange={this.handlePageIDTBE} as="select">
                                                {pageListDropDownMenu}
                                            </Form.Control>
                                        </Form.Group>
                                        }
                                        <Form>
                                            <Form.Group controlId="pageForm.Name">
                                                <Form.Label>Page Name</Form.Label>
                                                <Form.Control value={this.state.page.name} name="name"
                                                              onChange={this.handlePageFormChange}
                                                              type="name" placeholder="Example page name...."/>
                                            </Form.Group>
                                            <Form.Group controlId="pageForm.ParentID">
                                                <Form.Label>Parent Page ID</Form.Label>
                                                <Form.Control as="select">
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group
                                                controlId="PostForm.Icon">
                                                <Form.Label>Page Icon <FeatherIcon
                                                    icon={this.state.page.icon}/></Form.Label>
                                                <Form.Control as="select" name="icon" value={this.state.page.icon}
                                                              onChange={this.handlePageFormChange}>
                                                    {IconOptionList}
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                        <Form.Group controlId="formBasicCheckbox2">
                                            <Form.Check type="checkbox" label="Edit Mode"
                                                        value={this.state.editPageBoolean}
                                                        onChange={this.handlePageEditMode}>
                                            </Form.Check>
                                        </Form.Group>
                                        <Form.Check type="checkbox" label="Disable Page"
                                                    checked={this.state.page.disabled}
                                                    onChange={this.handleDisablePage}/>
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
                                            {this.state.editPageBoolean ? 'Update Page' : 'Add Page'}
                                        </Button>
                                    </Col>
                                </Row>
                            </post-contents>
                        </post>
                    </Tab>
                    <Tab eventKey="delete"
                         title={<FeatherIcon icon={"file-minus"}/>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Row>
                                    <Col lg={4} xs={12}>
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
                                                    disabled={(this.state.postIsLoading)}
                                                    onClick={!(this.state.postIsLoading) ? this.deletePost : null}>
                                                {(this.state.postIsLoading) ? <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> : ''}
                                                {'Delete Post'}
                                            </Button>
                                            <Form.Group controlId="deleteForm.userNamer">
                                                <Form.Label>Select User</Form.Label>
                                                <Form.Control value={this.state.selectedUserIDTBD}
                                                              onChange={this.handleUserIDTBD} as="select">
                                                    {userListDropDownMenu}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant={'primary'}
                                                    disabled={(this.state.userIsLoading)}
                                                    onClick={!(this.state.userIsLoading) ? this.deleteUser : null}>
                                                {(this.state.userIsLoading) ? <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> : ''}
                                                {'Delete User'}
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </post-contents>
                        </post>
                    </Tab>
                    <Tab eventKey="user"
                         title={<FeatherIcon icon={"users"}/>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Form>
                                    <Form.Row>
                                        {this.state.editUserBoolean &&
                                        <Form.Group controlId="userForm.selectUser">
                                            <Form.Label>Select User</Form.Label>
                                            <Form.Control
                                                value={this.state.selectedUserIDTBE}
                                                onChange={this.handleUserIDTBE} as="select">
                                                {userListDropDownMenu}
                                            </Form.Control>
                                        </Form.Group>
                                        }
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="userForm.name">
                                            <Form.Label>User Name</Form.Label>
                                            <Form.Control name="username" value={this.state.user.username}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="username...."/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="userForm.firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control name="firstName" value={this.state.user.firstName}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Joe"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="userForm.lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control name="lastName" value={this.state.user.lastName}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Smith"/>
                                        </Form.Group>

                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="userForm.streetAddress">
                                            <Form.Label>Street Address</Form.Label>
                                            <Form.Control name="streetAddress" value={this.state.user.streetAddress}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="123 Retro Corry Road"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="2" controlId="userForm.postCode">
                                            <Form.Label>Post Code</Form.Label>
                                            <Form.Control name="postCode" value={this.state.user.postCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="4720"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="userForm.state">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control name="state" value={this.state.user.state}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="QLD"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="userForm.country">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control name="country" value={this.state.user.country}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Australia"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="userForm.countryCode">
                                            <Form.Label>Code</Form.Label>
                                            <Form.Control name="countryCode" value={this.state.user.countryCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="AU"/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="userForm.email">
                                            <Form.Label>E-mail</Form.Label>
                                            <Form.Control name="email" value={this.state.user.email}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="joe@mail.com"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="userForm.areaCode">
                                            <Form.Label>Area Code</Form.Label>
                                            <Form.Control name="areaCode" value={this.state.user.areaCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="+61"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="userForm.mobile">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control name="mobile" value={this.state.user.mobile}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="041234567"/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="userForm.group">
                                            <Form.Label>Group</Form.Label>
                                            <Form.Control name="group" value={this.state.user.group}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="wheel = superuser"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="userForm.secondaryGroup">
                                            <Form.Label>Secondary Group</Form.Label>
                                            <Form.Control name="secondaryGroup" value={this.state.user.secondaryGroup}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="kettlebell"/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="userForm.password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control name="password" value={this.state.user.password}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="password1234"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="userForm.metadata">
                                            <Form.Label>Metadata</Form.Label>
                                            <Form.Control name="metadata" value={this.state.user.metadata}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="{}"/>
                                        </Form.Group>
                                    </Form.Row>
                                </Form>
                                <Form>
                                    <Form.Check type="checkbox" label="Edit Mode"
                                                value={this.state.userEditBoolean}
                                                onChange={this.handleUserEditMode}/>
                                    <Form.Check type="checkbox" label="Disable User"
                                                checked={this.state.user.disabled}
                                                onChange={this.handleDisableUser}/>
                                </Form>
                                <Button variant={'primary'}
                                        disabled={(this.state.userIsLoading)}
                                        onClick={!(this.state.userIsLoading) ? this.addUser : null}>
                                    {(this.state.userIsLoading) ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : ''}
                                    {this.state.editUserBoolean ? 'Update' : 'Add User'}
                                </Button>
                            </post-contents>
                        </post>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

export default App;

