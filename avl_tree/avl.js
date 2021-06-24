function read_input(element_id)
{
    let temp = document.getElementById(element_id);
    newTree.insertion(parseInt(temp.value));
    temp.value="";
}

class treeNode
{
    constructor(value)
    {
        this.value = value;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
    updateHeight()
    {
        let leftHeight = 0,rightHeight = 0;
        if (this.left)
        {
            leftHeight = this.left.height;
        }
        if (this.right)
        {
            rightHeight = this.right.height;
        }
        this.height = (leftHeight>rightHeight) ? (leftHeight+1) : (rightHeight+1);
    }
}

class avlTree
{
    constructor()
    {
        this.root = null;
        this.arr=[];
    }
    rotatell(parent,child,grandChild)
    {
        if (parent.parent)
        {
            if (parent.parent.left==parent) parent.parent.left = child;
            else parent.parent.right = child;
        }
        else this.root = child;
        parent.left = child.right;
        child.right = parent;
        child.parent = parent.parent;
        parent.parent = child;
    }
    rotaterr(parent,child,grandChild)
    {
        if (parent.parent)
        {
            if (parent.parent.left==parent) parent.parent.left = child;
            else parent.parent.right = child;
        }
        else this.root = child;
        parent.right = child.left;
        child.left = parent;
        child.parent = parent.parent;
        parent.parent = child;
    }
    rotatelr(parent,child,grandChild)
    {
        parent.left = grandChild;
        child.right = grandChild.left;
        grandChild.left = child;
        grandChild.parent = parent;
        child.parent = grandChild;
        this.rotatell(parent,grandChild,child)
    }
    rotaterl(parent,child,grandChild)
    {
        parent.right = grandChild;
        child.left = grandChild.right;
        grandChild.right = child;
        grandChild.parent = parent;
        child.parent = grandChild;
        this.rotaterr(parent,grandChild,child)
    }
    levelorder(root)
    {
        this.arr.push(root);
        document.getElementById('txt').innerHTML = "";
        while(this.arr.length>0)
        {
            let temp = this.arr.shift();
            document.getElementById('txt').innerHTML += temp.value+" ";
            if (temp.left) {this.arr.push(temp.left);}
            if (temp.right) {this.arr.push(temp.right);}
        }
    }
    insertion(value)
    {
        const newNode = new treeNode(value);
        if (this.root == null)
        {
            this.root = newNode;
            this.levelorder(this.root);
            return;
        }
        let temp = this.root;
        while(1)
        {
            if (temp.value>value)
            {
                if (temp.left)
                {
                    temp = temp.left;
                }
                else 
                {
                    temp.left = newNode;
                    newNode.parent = temp;
                    break;
                }
            }
            else
            {
                if (temp.right)
                {
                    temp = temp.right;
                }
                else 
                {
                    temp.right = newNode;
                    newNode.parent = temp;
                    break;
                }
            }
        }
        let child = newNode,grandChild = null;
        
        while(temp)
        {
            temp.updateHeight();
            if (temp.height>2)
            {
                let leftHeight = 0,rightHeight = 0;
                if (temp.left)
                {
                    leftHeight = temp.left.height;
                }
                if (temp.right)
                {
                    rightHeight = temp.right.height;
                }
                if (leftHeight-rightHeight>1) // ll or lr
                {
                    if (child.left===grandChild) // ll
                    {
                        this.rotatell(temp,child,grandChild);
                        temp.updateHeight();
                        child.updateHeight();
                        temp = child;
                    }
                    else if (child.right===grandChild) //lr
                    {
                        this.rotatelr(temp,child,grandChild);
                        temp.updateHeight();
                        child.updateHeight();
                        grandChild.updateHeight();
                        temp = grandChild;
                    }
                }
                else if (rightHeight-leftHeight>1) // rr or rl
                {
                    if (child.left===grandChild) //rl
                    {
                        this.rotaterl(temp,child,grandChild);
                        temp.updateHeight();
                        child.updateHeight();
                        temp = child;
                    }
                    else if (child.right===grandChild)//rr
                    {
                        this.rotaterr(temp,child,grandChild);
                        temp.updateHeight();
                        child.updateHeight();
                        grandChild.updateHeight();
                        temp = grandChild;
                    }
                }
            }
            grandChild = child;
            child = temp;
            temp = temp.parent;
        }
        this.levelorder(this.root);
    }
    
}

var newTree = new avlTree();
