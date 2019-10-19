import React, {Component} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import FeatherIcon from 'feather-icons-react';
import {Editor} from '@tinymce/tinymce-react';
import IconList from './icons'
import moment from "moment-timezone";
import Moment from "moment";


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
            selectedUserIDTBE: 0,
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
            msgs: [],
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
        this.closeToast = this.closeToast.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    closeToast(index) {
        let msgs = this.state.msgs;
        delete (msgs[index]);
        console.log(msgs);
        console.log(index);
        this.setState({msgs});
    }

    handleResponse(data, successTitle, failureTitle) {
        let msgs = this.state.msgs;
        let msg = {
            name: '',
            time: new Moment(),
            body: data.errorMessage
        };
        if (data.success === true) {
            msg.name = successTitle;
        } else {
            msg.name = failureTitle;
        }
        msgs.push(msg);
        this.setState({msgs});
    }

    /**
     * Pages related functions
     */

    // Toggles the page disabled boolean.
    handleDisablePage() {
        let page = this.state.page;
        page.disabled = !page.disabled;
        this.setState({page})
    }

    // Toggles the page edit mode boolean.
    handlePageEditMode() {
        let page = this.state.pageList[0];
        if (typeof page !== "undefined" && this.state.editPageBoolean === false) {
            this.setState({
                page, selectedPageIDTBE: page.id
            })
        }
        this.setState({editPageBoolean: !this.state.editPageBoolean})
    }

    // Handles all of the form changes for the page form. (Besides check boxes and drop downs.)
    handlePageFormChange(e) {
        let page = this.state.page;
        page[e.target.name] = e.target.value;
        this.setState({page})
    }

    // Handles our pageID.
    handlePageID(e) {
        this.setState({pageID: e.target.value});
    }

    // Select the page to be edited.
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

    // Handles our page id to be deleted.
    handlePageIDTBD(e) {
        this.setState({selectedPageIDTBD: e.target.value})
    }

    // Handles our selected icon.
    selectPageIcon(icon) {
        this.setState({selectedPageIcon: icon.target.value})
    }


    /**
     * Post related functions
     */
    // Toggles the disabled post boolean.
    handleDisablePost() {
        let post = this.state.post;
        post.disabled = !post.disabled;
        this.setState({post})
    }

    // Toggles the edit mode boolean.
    handlePostEditMode() {
        let post = this.state.postList[0];
        if (typeof post !== "undefined" && this.state.editPostBoolean === false) {
            this.setState({
                post, selectedPostIDTBE: post.id
            })
        }
        this.setState({editPostBoolean: !this.state.editPostBoolean})
    }

    // Handles all form fields except for drop downs and checkboxes.
    handlePostFormChange(e) {
        let post = this.state.post;
        post[e.target.name] = e.target.value;
        this.setState({post})
    }

    // Handles the TinyMCE editor content window.
    handleEditorChange(content) {
        let post = this.state.post;
        post.contents = content;
        this.setState({post});
    }

    // Handles our post id to be deleted.
    handlePostIDTBD(e) {
        this.setState({selectedPostIDTBD: e.target.value})
    }

    // Handles the selected post to be edited.
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

    // Handles our post icon.
    selectPostIcon(icon) {
        this.setState({selectedPostIcon: icon.target.value});
    }


    /**
     * User related functions
     */
    // Handles the user disabled boolean.
    handleDisableUser() {
        let user = this.state.user;
        user.disabled = !user.disabled;
        this.setState({user})
    }

    // Handles the user edit mode checkbox.
    handleUserEditMode() {
        let user = this.state.userList[0];
        this.setState({editUserBoolean: !this.state.editUserBoolean, user})
    }

    // Handles all form entries except for the checkbox and drop down fields.
    handleUserFormChange(e) {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({user})
    }

    // Handles our user id to be deleted.
    handleUserIDTBD(e) {
        this.setState({selectedUserIDTBD: e.target.value})
    }

    // Handles our selected user to be edited.
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


    /**
     * RESTFULL Functions below
     *
     * All functions user GET and POST.
     *
     */
    // Add our page to the server.
    // Page is stored in this.state.page
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
                this.handleResponse(data, 'Successfully added page.', 'Unable to add page.');
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: `Error adding page.`,
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, pageIsLoading: false});
            })
            .finally(() => {
                this.setState({pageIsLoading: false});
                this.getPages();
            })
    }

    // Add our post to the server.
    // Post is stored in this.state.post
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
                this.handleResponse(data, 'Successfully added post.', 'Unable to add post.');

            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                    name: `Error adding page.`,
                    time: new Moment(),
                    body: `Error: ${error}`
                };
                msgs.push(msg);
                this.setState({msgs, postIsLoading: false});
            })
            .finally(() => {
                this.setState({postIsLoading: false});
                this.getPosts();
            })
    }

    // Add our user to the server.
    // User is stored in this.state.user
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
                this.handleResponse(data, 'Successfully added user.', 'Unable to add user.');

            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                    name: `Error adding user.`,
                    time: new Moment(),
                    body: `Error: ${error}`
                };
                msgs.push(msg);
                this.setState({msgs, userIsLoading: false});
            })
            .finally(() => {
                this.setState({userIsLoading: false}, () => this.getUsers());
            })
    }

    // Delete the id selected in the delete tab.
    deletePage() {
        this.setState({pageIsLoading: true});
        let data = {
            id: this.state.selectedPageIDTBD,
            name: this.state.pageListLookup[this.state.selectedPageIDTBD].name
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
                this.handleResponse(data, 'Successfully deleted page.', 'Unable to delete page.');

            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                    name: `Error deleting page.`,
                    time: new Moment(),
                    body: `Error: ${error}`
                };
                msgs.push(msg);
                this.setState({msgs, pageIsLoading: false});
            })
            .finally(() => {
                this.getPages();
            })
    }

    // Delete the id selected in the delete tab.
    deletePost() {
        this.setState({postIsLoading: true});
        let data = {
            id: this.state.selectedPostIDTBD,
            name: this.state.postListLookup[this.state.selectedPostIDTBD].name
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
                this.handleResponse(data, 'Successfully delete post.', 'Unable to delete post.');

            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                    name: `Error deleting post.`,
                    time: new Moment(),
                    body: `Error: ${error}`
                };
                msgs.push(msg);
                this.setState({msgs, postIsLoading: false});
            })
            .finally(() => {
                this.getPosts();
            })
    }

    // Delete the id selected in the delete tab.
    deleteUser() {
        this.setState({userIsLoading: true});
        let data = {
            id: this.state.selectedUserIDTBD,
            username: this.state.userListLookup[this.state.selectedUserIDTBD].username
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
                this.handleResponse(data, 'Successfully deleted user.', 'Unable to delete user.');

            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                    name: `Error deleting user.`,
                    time: new Moment(),
                    body: `Error: ${error}`
                };
                msgs.push(msg);
                this.setState({msgs, userIsLoading: false});
            })
            .finally(() => {
                this.getUsers();
            })
    }

    // Get pages from the server and create lookup table.
    getPages() {
        this.setState({pageIsLoading: true});
        fetch("/api/getPages").then(response => response.json())
            .then((data) => {
                if (data.success === false) {
                    this.handleResponse(data, 'Successfully retrieved all pages.', 'Unable to get pages.');
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }

                this.setState({pageList: data, pageListLookup: lookup});
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: "Error retrieving pages.",
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, pageIsLoading: false});
            })
            .finally(() => {
                if (this.state.pageList.length > 0) {
                    this.setState({
                        selectedPageIDTBD: this.state.pageList[0].id
                    }) // set our page id so drop down works
                }
                this.setState({pageIsLoading: false}); // set our page id so drop down works
            });
    }

// Get posts from the server and create a lookup table.
    getPosts() {
        this.setState({postIsLoading: true});
        fetch("/api/getPosts").then(response => response.json())
            .then((data) => {
                if (data.success === false) {
                    this.handleResponse(data, 'Successfully retrieved all posts.', 'Unable to get posts.');
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }
                this.setState({postList: data, postListLookup: lookup});
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: "Error retrieving posts.",
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, postIsLoading: false});
            })
            .finally(() => {
                this.setState({postIsLoading: false});
                if (this.state.pageList.length > 0) {
                    let post = this.state.post;
                    post.pageID = this.state.pageList[0].id;
                    this.setState({
                        post,
                        selectedPostIDTBD: this.state.postList[0].id
                    }) // set our page id so drop down works
                }
                if (this.state.postList.length > 0) {
                    this.setState({
                        selectedPostIDTBD: this.state.postList[0].id
                    }) // set our page id so drop down works
                }
                this.setState({postIsLoading: false})
            })
    }

// Get users from the server and create a lookup table.
    getUsers() {
        this.setState({userIsLoading: true});
        fetch("/api/getUsers").then(response => response.json())
            .then((data) => {
                if (data.success === false) {
                    this.handleResponse(data, 'Successfully retrieved all users.', 'Unable to get users.');
                    return
                }
                let lookup = {};
                for (let i = 0, len = data.length; i < len; i++) {
                    lookup[data[i].id] = data[i];
                }
                this.setState({userList: data, userListLookup: lookup});
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: "Error retrieving users.",
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, userIsLoading: false});
            })
            .finally(() => {
                this.setState({userIsLoading: false});
                if (this.state.userList.length > 0) {
                    let selectedUserIDTBE = this.state.selectedUserIDTBE ? this.state.selectedUserIDTBE : this.state.userList[0].id;
                    let userID = this.state.userID ? this.state.userID : this.state.userList[0].id;
                    this.setState({
                        userID,
                        selectedUserIDTBE
                    }) // set our page id so drop down works
                }
            })
    }

    // Update page. Page is stored in this.state.page
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
                this.handleResponse(data, 'Successfully updated pages.', 'Unable to update page.');
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: "Error updating page.",
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, pageIsLoading: false})
            })
            .finally(() => {
                this.setState({pageIsLoading: false});
                this.getPages();
            })
    }

// Update post. Post is stored in this.state.post
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
                this.handleResponse(data, 'Successfully updated post.', 'Unable to update post.');
            })
            .catch((error) => {
                let msgs = this.state.msgs;
                let msg = {
                        name: `Error updating post.`,
                        time: new Moment(),
                        body: `Error: ${error}`
                    }
                ;
                msgs.push(msg);
                this.setState({msgs, postIsLoading: false});
            })
            .finally(() => {
                this.setState({postIsLoading: false});
                this.getPosts();
            })
    }


    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.getPages();
        this.getPosts();
        this.getUsers();
        console.log(this.state);
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
        const messages = this.state.msgs;
        const msgs = messages.map((_, index) => {
            return (
                <Toast key={index + new Date()} show={true} onClose={() => this.closeToast(index)} autohide>
                    <Toast.Header>
                        <img style={{width: 20, height: 20}} src="favicon.png" className="rounded mr-2" alt=""/>
                        <strong className="mr-auto">{messages[index].name}</strong>
                        <small>{messages[index].time.fromNow()}</small>
                    </Toast.Header>
                    <Toast.Body>{messages[index].body}</Toast.Body>
                </Toast>
            )
        });

        return (
            <Container fluid={true}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 100,
                }}>
                    {msgs}
                </div>
                <Tabs
                    id="tabs"
                    activeKey={this.state.key}
                    size="sm"
                    onSelect={key => this.setState({key})}
                >
                    <Tab eventKey="editPost"
                         title={<FeatherIcon icon={"edit"}/>}>
                        <br/>
                        <div className={'post'}>
                            <div className={'post-contents'}>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            {this.state.editPostBoolean &&
                                            <Form.Group controlId="post.select">
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
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="post.name">
                                                <Form.Label>Post Name</Form.Label>
                                                <Form.Control value={this.state.post.name} name="name"
                                                              onChange={this.handlePostFormChange}
                                                              type="name" placeholder="Example post name...."/>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col lg={4} xs={12}>
                                        <Form>

                                            <Form.Group controlId="post.pageID">
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
                                            <Form.Group controlId="post.icon">
                                                <Form.Label>Post Icon <FeatherIcon
                                                    icon={this.state.post.icon}/></Form.Label>
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
                                            <Form.Group controlId="post.editMode">
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
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Page"
                         title={<FeatherIcon icon={"file-plus"}/>}>
                        <br/>
                        <div className={'post'}>
                            <div className={'post-contents'}>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        {this.state.editPageBoolean &&
                                        <Form.Group controlId="page.select">
                                            <Form.Label>Select Page</Form.Label>
                                            <Form.Control
                                                value={this.state.selectedPageIDTBE}
                                                onChange={this.handlePageIDTBE} as="select">
                                                {pageListDropDownMenu}
                                            </Form.Control>
                                        </Form.Group>
                                        }
                                        <Form>
                                            <Form.Group controlId="page.name">
                                                <Form.Label>Page Name</Form.Label>
                                                <Form.Control value={this.state.page.name} name="name"
                                                              onChange={this.handlePageFormChange}
                                                              type="name" placeholder="Example page name...."/>
                                            </Form.Group>
                                            <Form.Group controlId="page.parentID">
                                                <Form.Label>Parent Page ID</Form.Label>
                                                <Form.Control as="select">
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group
                                                controlId="page.icon">
                                                <Form.Label>Page Icon <FeatherIcon
                                                    icon={this.state.page.icon}/></Form.Label>
                                                <Form.Control as="select" name="icon" value={this.state.page.icon}
                                                              onChange={this.handlePageFormChange}>
                                                    {IconOptionList}
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                        <Form.Group controlId="page.editMode">
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
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="delete"
                         title={<FeatherIcon icon={"file-minus"}/>}>
                        <br/>
                        <div className={'post'}>
                            <div className={'post-contents'}>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="delete.page.name">
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
                                            <Form.Group controlId="delete.post.name">
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
                                            <Form.Group controlId="delete.user.username">
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
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="user"
                         title={<FeatherIcon icon={"users"}/>}>
                        <br/>
                        <div className={'post'}>
                            <div className={'post-contents'}>
                                <Form>
                                    <Form.Row>
                                        {this.state.editUserBoolean &&
                                        <Form.Group controlId="user.selectUser">
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
                                        <Form.Group as={Col} md="4" controlId="user.name">
                                            <Form.Label>User Name</Form.Label>
                                            <Form.Control name="username" value={this.state.user.username}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="username...."/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="user.firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control name="firstName" value={this.state.user.firstName}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Joe"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="user.lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control name="lastName" value={this.state.user.lastName}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Smith"/>
                                        </Form.Group>

                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="user.streetAddress">
                                            <Form.Label>Street Address</Form.Label>
                                            <Form.Control name="streetAddress" value={this.state.user.streetAddress}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="123 Retro Corry Road"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="2" controlId="user.postCode">
                                            <Form.Label>Post Code</Form.Label>
                                            <Form.Control name="postCode" value={this.state.user.postCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="4720"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="user.state">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control name="state" value={this.state.user.state}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="QLD"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="user.country">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control name="country" value={this.state.user.country}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="Australia"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="user.countryCode">
                                            <Form.Label>Code</Form.Label>
                                            <Form.Control name="countryCode" value={this.state.user.countryCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="AU"/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="user.email">
                                            <Form.Label>E-mail</Form.Label>
                                            <Form.Control name="email" value={this.state.user.email}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="joe@mail.com"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="user.areaCode">
                                            <Form.Label>Area Code</Form.Label>
                                            <Form.Control name="areaCode" value={this.state.user.areaCode}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="+61"/>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="user.mobile">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control name="mobile" value={this.state.user.mobile}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="041234567"/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="user.group">
                                            <Form.Label>Group</Form.Label>
                                            <Form.Control name="group" value={this.state.user.group}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="wheel = superuser"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="user.secondaryGroup">
                                            <Form.Label>Secondary Group</Form.Label>
                                            <Form.Control name="secondaryGroup" value={this.state.user.secondaryGroup}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="kettlebell"/>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="user.password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control name="password" value={this.state.user.password}
                                                          onChange={this.handleUserFormChange}
                                                          placeholder="password1234"/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="user.metadata">
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
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

export default App;

