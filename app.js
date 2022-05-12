const mainInput = document.getElementById("myInput");
const commentList = document.getElementById("commentList");

let addComment = () =>{
    if(!localStorage.getItem("comments")){
        comments =[];
        localStorage.setItem("comments",JSON.stringify(comments))
    }
    comments = JSON.parse( localStorage.getItem("comments"));
    comments.push({
        parentCommentId: null,
        commentId:Math.random()
        .toString()
        .substr(2, 7),
        commentText: mainInput.value,
        childComments: [],
        likes: 0

    })
    localStorage.setItem("comments",JSON.stringify(comments))
    fillCommentList()
    mainInput.value = ""

}
const fillCommentList = () =>{
    const getCommentList = JSON.parse(localStorage.getItem("comments"));
    if(getCommentList) {
        // console.log("getCommentList= ",getCommentList);
        commentList.innerHTML= getRecursiveCommentList(getCommentList)
    }
}

const getRecursiveCommentList = (getCommentList,margin=0) => {
    htmlView = "";

    console.log("getCommentList2 = ",getCommentList);
    for(let i of getCommentList){
        htmlView += getSingleCommentView(i,margin);
        console.log(i.commentText);
        if(i.childComments.length>=0){
            margin +=10;
            htmlView+=getRecursiveCommentList(i.childComments,margin)
            margin-=10;
        }
    }
    return htmlView
}
const getSingleCommentView = (data,margin) =>{
    return `<div style="margin-left:${margin}px" data-parentId="${data.parentCommentId}" data-id="${data.commentId}">
    <span >${data.commentText}</span>
    <span>(${data.likes})</span>
    <span>Reply</span>
    <span>Like</span>
    </div>`
}
const createReplyButtonCommentView = (id,operation) =>{
    let div = document.createElement("div")
    div.setAttribute("data-parentId",id);
    div.innerHTML = `<input type="text"><a href="#">Add Comment</a>`;
    return div

}
const getAllComments = () => JSON.parse(localStorage.getItem("comments"))
const addNewChildComment = (allComments,newComment) => {
    console.log("newComment.parentCommentId",newComment.parentCommentId)
    for(let i of allComments){
        console.log("i= ",i)
        if(i.commentId===newComment.parentCommentId){
            i.childComments.push(newComment)
            return 0;
        } else if(i.childComments.length >0) {
            addNewChildComment (i.childComments,newComment)

        }
    }
}
const likeComment = (allComments,id) => {
    // console.log("newComment.parentCommentId",newComment.parentCommentId)
    for(let i of allComments){
        
        if(i.commentId===id){
            i.likes++
            console.log("i.likes= ",i.likes)
            return 0;
        } else if(i.childComments.length >0) {
            likeComment (i.childComments,id)

        }
    }
}
const setCommentsLC = allCommentsfromLS => localStorage.setItem("comments",JSON.stringify(allCommentsfromLS))
fillCommentList()
commentList.addEventListener('click',e => {
    if(e.target.innerText=="Reply"){
        const parentId = !e.target.parentNode.getAttribute("data-parentId") ? e.target.parentNode.getAttribute("data-parentId") : e.target.parentNode.getAttribute("data-id");
        //  console.log("Reply parentId",parentId)

        const currentParentComment = e.target.parentNode;
		currentParentComment.appendChild(
			createReplyButtonCommentView(parentId, "Add Comment")
		);
		e.target.style.display = "none";
		// e.target.nextSibling.style.display = "none";
    } else if (e.target.innerText=="Add Comment") {
        const parentId = e.target.parentNode.getAttribute("data-parentId") ?
         e.target.parentNode.getAttribute("data-parentId") 
         : e.target.parentNode.getAttribute("data-id");
        //  console.log("parentId= ",e.target.parentNode.getAttribute("data-id"))
         const newComment = {
            parentCommentId: parentId,
            commentId:Math.random()
            .toString()
            .substr(2, 7),
            commentText: e.target.parentNode.firstChild.value,
            childComments: [],
            likes: 0
         }
         const allCommentsfromLS = getAllComments()
         addNewChildComment(allCommentsfromLS,newComment)
         console.log("allCommentsfromLS",allCommentsfromLS)
         setCommentsLC(allCommentsfromLS)
         fillCommentList()


    } else  if  (e.target.innerText=="Like") {
        const parentId = e.target.parentNode.getAttribute("data-parentId")===null ?
         e.target.parentNode.getAttribute("data-parentId") 
         : e.target.parentNode.getAttribute("data-id");
         console.log("parentId= ",parentId)
         const allCommentsfromLS = getAllComments()
         likeComment(allCommentsfromLS,parentId)
         setCommentsLC(allCommentsfromLS)
         fillCommentList()

    }

})
