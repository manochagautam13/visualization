function read_input(element_id)
{
    let temp = document.getElementById(element_id);
    if (element_id=='insert_input') newTree.insertion(parseInt(temp.value));
    else if (element_id=='delete_input') newTree.deletion(parseInt(temp.value));
    else if (element_id=='find_input')
    {
        if (newTree.find(parseInt(temp.value))==null) document.getElementById('lvl').innerHTML = "Couldn't find";
        else document.getElementById('lvl').innerHTML = "found";
    }
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
        child.right.parent = parent;
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
        child.left.parent = parent;
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
        document.getElementById('lvl').innerHTML = "Level Order : ";
        while(this.arr.length>0)
        {
            let temp = this.arr.shift();
            console.log(temp);
            if (temp.parent && temp.parent.left == temp) document.getElementById('lvl').innerHTML += temp.parent.value+'L';
            else if (temp.parent && temp.parent.right == temp) document.getElementById('lvl').innerHTML += temp.parent.value+'R';
            document.getElementById('lvl').innerHTML += temp.value+" ";
            if (temp.left) {this.arr.push(temp.left);}
            if (temp.right) {this.arr.push(temp.right);}
        }
    }
    inorder(node)
    {
        if (node==null) return;
        this.inorder(node.left);
        document.getElementById('in').innerHTML += node.value+" ";
        this.inorder(node.right);
    }
    insertion(value)
    {
        const newNode = new treeNode(value);
        if (this.root == null)
        {
            this.root = newNode;
            this.levelorder(this.root);
            document.getElementById('in').innerHTML = "Inorder: 4";
            this.inorder(this.root);
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
        if (this.root) 
        {
            this.levelorder(this.root);
            document.getElementById('in').innerHTML = "Inorder: ";
            this.inorder(this.root);
        }
    }
    find(value)
    {
        if (this.root==null) return null;
        let temp = this.root;
        while(temp)
        {
            if (temp.value<value) temp = temp.right;
            else if (temp.value>value) temp = temp.left;
            else return temp;
        }
        return null;
    }
    deletion(value)
    {
        let node = this.find(value);
        if (node==null) return;
        let parent = node.parent;
        if (node.left && node.right)
        {
            let temp = node.right;
            if (!temp.left) 
            {
                temp.parent.right = temp.right;
                if (temp.right) temp.right.parent = temp.parent;
                parent = temp.parent;
                temp.parent = null;
                node.value = temp.value;
                temp.right = null;
            }
            else
            {
                while(temp.left) temp = temp.left;
                parent = temp.parent;
                temp.parent.left = temp.right;
                if (temp.right) temp.right.parent = temp.parent;
                node.value = temp.value;
                temp.parent = null;
                temp.right = null;
            }
        }
        else
        {
            let temp = node.left;
            if (temp==null) temp = node.right;
            if (node==this.root) this.root = temp;
            else if (node.parent.left == node) node.parent.left = temp;
            else node.parent.right = temp;
            if (temp) temp.parent = node.parent;
            node.parent = null;
            node.left = null;
            node.right = null;
        }
        while(parent)
        {
            parent.updateHeight();
            let leftHeight = 0,rightHeight = 0;
            if (parent.left) leftHeight = parent.left.height;
            if (parent.right) rightHeight = parent.right.height;
            if (leftHeight-rightHeight>1)
            {
                let child = parent.left;
                let lh=0,rh=0;
                if (child.left) lh = child.left.height;
                if (child.right) rh = child.right.height;
                if (lh>=rh) this.rotatell(parent,child,child.left);
                else this.rotatelr(parent,child,child.right);
            }
            else if (rightHeight-leftHeight>1)
            {
                let child = parent.right;
                let lh=0,rh=0;
                if (child.left) lh = child.left.height;
                if (child.right) rh = child.right.height;
                if (rh>=lh) this.rotaterr(parent,child,child.right);
                else this.rotaterl(parent,child,child.left);
            }
            parent = parent.parent;
        }
        if (this.root) 
        {
            this.levelorder(this.root);
            document.getElementById('in').innerHTML = "Inorder: ";
            this.inorder(this.root);
        }
    }
}

var newTree = new avlTree();
