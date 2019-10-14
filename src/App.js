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
import FeatherIcon from 'feather-icons-react';
import {Editor} from '@tinymce/tinymce-react';
import IconList from './icons'

class App extends Component {
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
            userName: '',
            groupName: '',
            secondaryGroup: '',
            userPassword: ''
        };

        this.addUser = this.addUser.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleSecondaryGroupChange = this.handleSecondaryGroupChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.addPage = this.addPage.bind(this);
        this.handlePostEditMode = this.handlePostEditMode.bind(this);
        this.handlePageEditMode = this.handlePageEditMode.bind(this);
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
        this.handleUserIDTBD = this.handleUserIDTBD.bind(this);
        this.handlePageIDTBE = this.handlePageIDTBE.bind(this);
        this.handlePostIDTBE = this.handlePostIDTBE.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    handleUserNameChange(e) {
        this.setState({userName: e.target.value})
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
                //TODO does the below entry need to be deleted? As setState happens twice for it.
                selectedPostIDTBE: thisPostID,
                postName: thisPost.name,
                selectedPostIcon: thisPost.icon,
                postContents: thisPost.contents
            })
        }
        this.setState({selectedPostIDTBE: thisPostID})
    }

    handleUserIDTBD(e) {
        const thisUserID = e.target.value;
        console.log("User ID: " +  thisUserID);
        const thisUser= this.state.userListLookup[thisUserID];
        console.log("User name: "  + thisUser.name);
        if (typeof thisUser !== "undefined") {
            this.setState({
                userName: thisUser.name,
            })
        }
        this.setState({selectedUserIDTBD: thisUserID})
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
                console.log(data);
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
                if (this.state.userList.length > 0) {
                    this.setState({
                        userIsLoading: false,
                        userID: this.state.userList[0].id,
                        selectedUserIDTBD: this.state.userList[0].id
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

    addUser() {

        this.setState({userIsLoading: true});
        let data = {
            name: this.state.userName,
            group: this.state.groupName,
            secondaryGroup: this.state.secondaryGroup,
            password: this.state.userPassword,
            metadata: "this is the metadata"
        };
        fetch("/api/addUser",
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
        var data = {
            id: this.state.selectedPageIDTBE,
            name: this.state.pageName,
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
        var data = {
            id: this.state.selectedPostIDTBE,
            name: this.state.postName,
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
            name: "On the chopping block."
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
                    value={this.state.userList[index].id}>[{this.state.userList[index].id}] {this.state.userList[index].name}</option>
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
                         title={<FeatherIcon icon={"file-plus"}></FeatherIcon>}>
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
                                            <Form.Group controlId="deleteForm.userName">
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
                         title={<FeatherIcon icon={"users"}></FeatherIcon>}>
                        <br/>
                        <post>
                            <post-contents>
                                <Row>
                                    <Col lg={4} xs={12}>
                                        <Form>
                                            <Form.Group controlId="userForm.Name">
                                                <Form.Label>User Name</Form.Label>
                                                <Form.Control value={this.state.userName}
                                                              onChange={this.handleUserNameChange}
                                                              type="name" placeholder="username...."/>
                                            </Form.Group>
                                            <Form.Group controlId="group.Name">
                                                <Form.Label>Group</Form.Label>
                                                <Form.Control value={this.state.groupName}
                                                              onChange={this.handleGroupChange}
                                                              type="name" placeholder="wheel = admin...."/>
                                            </Form.Group>
                                            <Form.Group controlId="secondaryGroup.Name">
                                                <Form.Label>Secondary Group</Form.Label>
                                                <Form.Control value={this.state.secondaryGroup}
                                                              onChange={this.handleSecondaryGroupChange}
                                                              type="name" placeholder="extra groups...."/>
                                            </Form.Group>
                                            <Form.Group controlId="password.Name">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control value={this.state.userPassword}
                                                              onChange={this.handlePasswordChange}
                                                              type="name" placeholder="password...."/>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
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
                                    {'Add User'}
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

