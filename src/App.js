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
            editPostBoolean: false,
            editPageBoolean: false,
            postIsLoading: false,
            pageIsLoading: false,
            selectedPageIcon: "camera",
            selectedPostIcon: "camera",
            pageList: [],
            postList: [],
            userList: [],
            pageID: '',
            postContents: '',
            pageName: "Please enter a name...",
            postName: "Please enter a name...",
            selectedPageIDTBD: '',
            selectedPostIDTBD: '',
            selectedUserIDTBD: '',
            selectedPageIDTBE: '',
            selectedPostIDTBE: '',
            selectedUserIDTBE: '',
            pageListLookup: {},
            postListLookup: {},
            // username stuff
            userIsLoading: false,
            userEditBoolean: false,
            userDisabledBoolean: false,
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

        this.addUser = this.addUser.bind(this);
        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleSecondaryGroupChange = this.handleSecondaryGroupChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.addPage = this.addPage.bind(this);
        this.handlePostEditMode = this.handlePostEditMode.bind(this);
        this.handlePageEditMode = this.handlePageEditMode.bind(this);
        this.handleUserEditMode = this.handleUserEditMode.bind(this);
        this.addPost = this.addPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.selectPageIcon = this.selectPageIcon.bind(this);
        this.selectPostIcon = this.selectPostIcon.bind(this);
        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.handlePostNameChange = this.handlePostNameChange.bind(this);
        this.handlePageID = this.handlePageID.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getPages = this.getPages.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.handlePageIDTBD = this.handlePageIDTBD.bind(this);
        this.handlePostIDTBD = this.handlePostIDTBD.bind(this);
        this.handlePageIDTBE = this.handlePageIDTBE.bind(this);
        this.handlePostIDTBE = this.handlePostIDTBE.bind(this);
        this.handleUserIDTBE = this.handleUserIDTBE.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.handleDisableUser = this.handleDisableUser.bind(this);
    }

    // Use the .name field to dynamically handle all field values...
    // This way we can use one handler for the whole form group.
    handleUserFormChange(e) {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        console.log(this.state.user);
        console.log(this.state.selectedUserIDTBE);
        this.setState({user})
    }

    handleGroupChange(e) {
        this.setState({groupName: e.target.value})
    }

    handleSecondaryGroupChange(e) {
        this.setState({secondaryGroup: e.target.value})
    }

    handlePasswordChange(e) {
        this.setState({userPassword: e.target.value})
    }

    handlePostEditMode() {
        const newEditMode = !this.state.editPostBoolean;
        this.setState({editPostBoolean: newEditMode})
    }

    handlePageEditMode() {
        const newEditMode = !this.state.editPageBoolean;
        this.setState({editPageBoolean: newEditMode})
    }

    handleUserEditMode() {
        let user = this.state.userList[0];
        this.setState({editUserBoolean: !this.state.editUserBoolean, user})
    }

    handlePageIDTBD(e) {
        this.setState({selectedPageIDTBD: e.target.value})
    }

    handlePostIDTBD(e) {
        this.setState({selectedPostIDTBD: e.target.value})
    }

    handlePageIDTBE(e) {
        const thisPageID = e.target.value;
        const thisPage = this.state.pageListLookup[thisPageID];
        if (typeof thisPage !== "undefined") {
            this.setState({
                selectedPageIDTBE: thisPageID,
                pageName: thisPage.name,
                selectedPageIcon: thisPage.icon,
                pageContents: thisPage.contents
            })
        }
        this.setState({selectedPageIDTBE: thisPageID})
    }

    handlePostIDTBE(e) {
        const thisPostID = e.target.value;
        const thisPost = this.state.postListLookup[thisPostID];
        if (typeof thisPost !== "undefined") {
            this.setState({
                postName: thisPost.name,
                selectedPostIcon: thisPost.icon,
                postContents: thisPost.contents
            })
        }
        this.setState({selectedPostIDTBE: thisPostID})
    }

    // Changes our form to edit users.
    handleUserIDTBE(e) {
        const thisUserID = e.target.value;
        const user = this.state.userListLookup[thisUserID];
        console.log("User ID: " + user.id);
        console.log("User name: " + user.username);
        console.log("Disabled: " + user.disabled);
        console.log("Checkbox state: " + this.state.userDisabledBoolean);

        if (typeof user !== "undefined") {
            this.setState({
                user,
                userDisabledBoolean: user.disabled
            })
        }
        this.setState({selectedUserIDTBE: thisUserID});
    }


    handleDisableUser() {
        let user  = this.state.user;
        user.disabled = !user.disabled;
        this.setState({user})
    }

    handleEditorChange(content, editor) {
        this.setState({postContents: content});
    }

    handlePageNameChange(e) {
        this.setState({pageName: e.target.value})
    }

    handlePostNameChange(e) {
        this.setState({postName: e.target.value});
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
                this.setState({pageIsLoading: false}); // set our page id so drop down works
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


    loadData() {
        this.setState({pageIsLoading: true});
        fetch("/api/getAllPostsAndPages").then(response => response.json())
            .then((data) => {
                console.log(data);
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
        if (this.state.editPageBoolean) {
            console.log("Updating page");
            this.updatePage();
            return;
        }
        this.setState({pageIsLoading: true});
        //TODO fill in empty fields
        let data = {
            name: this.state.pageName,
            icon: this.state.selectedPageIcon,
            createdTime: new Date(),
            timeZone: moment.tz.guess(),
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

    //TODO add missing fields.
    addUser() {
        this.setState({userIsLoading: true});
        const editMode = this.state.editUserBoolean
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
        let data = {
            id: this.state.selectedPageIDTBE,
            username: this.state.pageName,
            pageID: this.state.pageID,
            icon: this.state.selectedPageIcon,
            createdTime: new Date(),
            contents: this.state.pageContents
        };
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
        let data = {
            id: this.state.selectedPostIDTBE,
            username: this.state.postName,
            pageID: this.state.pageID,
            icon: this.state.selectedPostIcon,
            createdTime: new Date(),
            contents: this.state.postContents
        };
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
        let data = {
            name: this.state.postName,
            pageID: this.state.pageID,
            icon: this.state.selectedPostIcon,
            createdTime: new Date(),
            timeZone: moment.tz.guess(),
            contents: this.state.postContents
        };
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
        console.log(this.state);
        this.setState({pageIsLoading: true});
        console.log(`Page ID: ${this.state.pageID}`);
        var data = {
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
        console.log(`Post ID: ${this.state.postID}`);
        var data = {
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
        console.log(`User ID: ${this.state.userID}`);
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
        this.getPosts(); // load our post and page list on load
        this.getPages();
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

        return (
            <Container fluid={true}>
                <Tabs
                    id="tabs"
                    activeKey={this.state.key}
                    size="sm"
                    onSelect={key => this.setState({key})}
                >
                    <Tab eventKey="editPost"
                         title={<FeatherIcon icon={"edit"}></FeatherIcon>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Row>
                                    <Col xs={12}>
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>

                                            <Form.Group controlId="postForm.Edit">
                                                <Form.Label>Post Name</Form.Label>
                                                <Form.Control value={this.state.postName}
                                                              onChange={this.handlePostNameChange}
                                                              type="name" placeholder="Example post name...."/>
                                            </Form.Group>
                                        </Form>
                                    </Col>

                                    <Col lg={4} xs={12}>
                                        <Form>
                                            {this.state.editPostBoolean &&
                                            <Form.Group controlId="deleteForm.postName">
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

                                </Row>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>

                                            <Form.Group controlId="PostForm.ParentID">
                                                <Form.Label>Parent Page ID</Form.Label>
                                                <Form.Control value={this.state.pageID} onChange={this.handlePageID}
                                                              as="select">
                                                    {pageListDropDownMenu}
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="PostForm.Icon">
                                                <Form.Label>Page Icon <FeatherIcon
                                                    icon={this.state.selectedPostIcon}/></Form.Label>
                                                <Form.Control onChange={this.selectPostIcon.bind(this)}
                                                              value={this.state.selectedPostIcon} as="select">
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
                                    </Col>
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
                                        <Form>
                                            <Form.Group controlId="pageForm.Name">
                                                <Form.Label>Post Name</Form.Label>
                                                <Form.Control value={this.state.pageName}
                                                              onChange={this.handlePageNameChange}
                                                              type="name" placeholder="Example post name...."/>
                                            </Form.Group>
                                            <Form.Group controlId="pageForm.ParentID">
                                                <Form.Label>Parent Page ID</Form.Label>
                                                <Form.Control as="select">
                                                </Form.Control>
                                            </Form.Group>
                                            {this.state.editPageBoolean &&
                                            <Form.Group controlId="deleteForm.pageName">
                                                <Form.Label>Select Page</Form.Label>
                                                <Form.Control
                                                    value={this.state.selectedPageIDTBE}
                                                    onChange={this.handlePageIDTBE} as="select">
                                                    {pageListDropDownMenu}
                                                </Form.Control>
                                            </Form.Group>
                                            }
                                            <Form.Group onChange={this.selectPageIcon.bind(this)}
                                                        controlId="PostForm.Icon">
                                                <Form.Label>Page Icon <FeatherIcon
                                                    icon={this.state.selectedPageIcon}/></Form.Label>
                                                <Form.Control as="select">
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
                         title={<FeatherIcon icon={"file-minus"}></FeatherIcon>}>
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
                                    </Col>
                                </Row>
                            </post-contents>
                        </post>
                    </Tab>
                    <Tab eventKey="user"
                         title={<FeatherIcon icon={"users"}></FeatherIcon>}>
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

