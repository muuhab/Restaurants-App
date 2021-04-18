import React,{Component} from 'react';
import {Card,CardImg,CardText,CardBody,CardTitle,Breadcrumb, BreadcrumbItem,Label,Button,Modal,ModalBody,ModalHeader} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class Comment extends Component {
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false
        }
        this.toggleModal=this.toggleModal.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    toggleModal(){
        this.setState({
            isModalOpen:!this.state.isModalOpen
        })
    }
    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <div className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                    <Control.Select model=".rating" name="rating" id="rating"
                                        className="form-control" defaultValue="1" >
                                        <option >1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.Select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="firstname">Your Name</Label>
                                    <Control.Text model=".author" id="firstname" name="firstname"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                             minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                          <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="message">Comment</Label>
                                    <Control.Textarea model=".comment" id="message" name="message"
                                        divs="6"
                                        className="form-control" />
                            </div>
                            <div className="form-group">
                                    <Button type="submit" value="Submit" color="primary">
                                        Submit
                                    </Button>
                            </div>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
            
        );
    }
}

    function RenderDish({dish}){
        if(dish!=null){
            return(
                <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg width="100%" src={baseUrl + dish.image}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
                </FadeTransform>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }
    function RenderComments({comments,postComment,dishId}){
        if(comments!=null){
            const com=comments.map((comment)=>{return(
                <Fade in>
                <div key={comment.id}>
    
                
                <ul className="list-unstyled">
                         <li>
                        {comment.comment}
                    </li>
                    <li>
                        -- {comment.author},{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                    </li>
                </ul>
                </div>
                </Fade>

            );
        });
        return(
            <div >
                <h4>Comments</h4>
                <Stagger in>
                {com}
            </Stagger>
                <Comment dishId={dishId} postComment={postComment} />

            </div>

        );
        }
        else{
            return(<div></div>);
        }
     
       
    }
        const DishDetail=(props)=>{
            if (props.isLoading) {
                return(
                    <div className="container">
                        <div className="row">            
                            <Loading />
                        </div>
                    </div>
                );
            }
            else if (props.errMess) {
                return(
                    <div className="container">
                        <div className="row">            
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                );
            }
            else if (props.dish != null) 
                return(
                    <div className="container">
                        <div className="row">
                        <Breadcrumb>

                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
        
                    <RenderDish dish={props.dish}/>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                        
                    
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id} /> 
                        </div>
                </div>
                </div>
                );
        
    
    
        }
        
export default DishDetail