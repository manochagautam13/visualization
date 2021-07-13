async function read_input(element_id)
{
    var temp = document.getElementById(element_id);
    temp = temp.value;
    const nodeArr = temp.split(",");

    if (element_id=='insert_input') 
    {
        for (var i = 0; i < nodeArr.length; i++)
        {
            await newTree.insertion(parseInt(nodeArr[i]));
        }
    }
    else if (element_id=='delete_input') 
    {
        for (var i = 0; i < nodeArr.length; i++)
        {
            await newTree.deletion(parseInt(nodeArr[i]));
        }
    }
    else if (element_id=='find_input')
    {
        for (var i = 0; i < nodeArr.length; i++)
        {
            if (newTree.find(parseInt(nodeArr[i]))==null) 
                document.getElementById('lvl').innerHTML = "Couldn't find";
            else 
                document.getElementById('lvl').innerHTML = "found";    
        }
    }
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
        this.x = 40;
        this.y = 40;
        this.radius = 30;
        this.newX = 40;
        this.newY = 40;
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
        this.speed = 1;
        this.constX = 750;
        this.constY = 100;
        this.timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
        this.step = 3;
    }

    newPosition(node, x, y)
    {
        if (node == null) return x;
        x = this.newPosition(node.left, x, y+1);
        node.newX = x;
        node.newY = y;
        
        x++;
        x = this.newPosition(node.right, x, y+1);
        return x;
    }

    relativePositionUpdate(node)
    {
        if (node==null) return;
        this.relativePositionUpdate(node.left);
        
        if (node != this.root)
        {
            node.newX = (node.newX - this.root.newX)*2*node.radius + this.constX;
            node.newY = node.newY*100;
        }
        
        this.arr.push(node);
        this.relativePositionUpdate(node.right);
    }

    async move()
    {
        let canvas = document.getElementById('board');
        let ctx = canvas.getContext('2d');
        
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let stopAnimation = true;

        for (let node of this.arr)
        {
            
            let slope = 1;
            
            let xshift = this.step+(-2*this.step)*(node.x-node.newX>0),yshift=0;
            if (node.x == node.newX) xshift=0;
            if (xshift==0)
            {
                if (Math.abs(node.y - node.newY)<1) yshift =0;
                else yshift = this.step+(-2*this.step)*(node.y-node.newY>0);
            }
            else
            {
                slope = (node.newY-node.y)/(node.newX-node.x);
                yshift = xshift*slope;
            }
            
            node.x += xshift;
            node.y += yshift;

            if (node.x != node.newX || node.y != node.newY)
                stopAnimation = false;
            
            if (Math.abs(node.x-node.newX) < this.step && Math.abs(node.y-node.newY)<this.step)
            {
                node.x = node.newX;
                node.y = node.newY;
            }
            
    
            this.drawInsert(node);
        }

        

        if (stopAnimation)
        {   
            this.arr = [];
            console.log(this.arr);
        }
        else
        {
            await this.timeout(this.speed);
        await this.move();
        }
        
    }

    async rotatell(parent,child,grandChild)
    {
        if (parent.parent)
        {
            if (parent.parent.left==parent) parent.parent.left = child;
            else parent.parent.right = child;
        }
        else this.root = child;
        parent.left = child.right;
        if (child.right) child.right.parent = parent;
        child.right = parent;
        child.parent = parent.parent;
        parent.parent = child;
        parent.updateHeight();
        child.updateHeight();
        grandChild.updateHeight();
    }
    async rotaterr(parent,child,grandChild)
    {
        if (parent.parent)
        {
            if (parent.parent.left==parent) parent.parent.left = child;
            else parent.parent.right = child;
        }
        else this.root = child;
        parent.right = child.left;
        if (child.left) child.left.parent = parent;
        child.left = parent;
        child.parent = parent.parent;
        parent.parent = child;
        parent.updateHeight();
        child.updateHeight();
        grandChild.updateHeight();
    }
    async rotatelr(parent,child,grandChild)
    {
        parent.left = grandChild;
        child.right = grandChild.left;
        if (grandChild.left)grandChild.left.parent = child;
        grandChild.left = child;
        grandChild.parent = parent;
        child.parent = grandChild;

        parent.updateHeight();
        child.updateHeight();
        grandChild.updateHeight();

        this.newPosition(this.root, 0, 1);
        this.relativePositionUpdate(this.root);
        this.root.newX = this.constX;
        this.root.newY = this.constY;
        console.log("before");
        await this.move();
        console.log('after');
        
        this.rotatell(parent,grandChild,child);
    }
    async rotaterl(parent,child,grandChild)
    {
        parent.right = grandChild;
        child.left = grandChild.right;
        console.log(child,grandChild);
        if (grandChild.right) grandChild.right.parent = child;
        grandChild.right = child;
        grandChild.parent = parent;
        child.parent = grandChild;

        parent.updateHeight();
        child.updateHeight();
        grandChild.updateHeight();

        this.newPosition(this.root, 0, 1);
        this.relativePositionUpdate(this.root);
        this.root.newX = this.constX;
        this.root.newY = this.constY;
        console.log("before");
        await this.move();
        console.log('after');
        
        this.rotaterr(parent,grandChild,child);
    }
    async levelorder(root)
    {
        this.arr.push(root);
        document.getElementById('lvl').innerHTML = "Level Order : ";
        while(this.arr.length>0)
        {
            let temp = this.arr.shift();
            
            if (temp.parent && temp.parent.left == temp) document.getElementById('lvl').innerHTML += temp.parent.value+'L';
            else if (temp.parent && temp.parent.right == temp) document.getElementById('lvl').innerHTML += temp.parent.value+'R';
            document.getElementById('lvl').innerHTML += temp.value+"("+temp.height+") ";
            if (temp.left) {this.arr.push(temp.left);}
            if (temp.right) {this.arr.push(temp.right);}
        }
    }
    async inorder(node)
    {
        if (node==null) return;
        this.inorder(node.left);
        document.getElementById('in').innerHTML += node.value+" ("+node.newX+") ";
        this.inorder(node.right);
    }


    


    

    async insertion(value)
    {
        const newNode = new treeNode(value);
        if (this.root == null)
        {
            this.root = newNode;

            this.levelorder(this.root);
            document.getElementById('in').innerHTML = "Inorder: ";
            this.inorder(this.root);

            this.drawInsert(this.root);
            this.newPosition(this.root, 0, 1);
            this.relativePositionUpdate(this.root);
            
            this.root.newX = this.constX, this.root.newY = this.constY;

            await this.move();

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

        this.newPosition(this.root, 0, 1);
        this.relativePositionUpdate(this.root);
        this.root.newX = this.constX;
        this.root.newY = this.constY;
        await this.move();
        
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
                        await this.rotatelr(temp,child,grandChild);
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
                        await this.rotaterl(temp,child,grandChild);
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

            this.newPosition(this.root, 0, 1);
            this.relativePositionUpdate(this.root);
            this.root.newX = this.constX;
            this.root.newY = this.constY;
            await this.move();

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

    async deletion(value)
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
                else await this.rotatelr(parent,child,child.right);
            }
            else if (rightHeight-leftHeight>1)
            {
                let child = parent.right;
                let lh=0,rh=0;
                if (child.left) lh = child.left.height;
                if (child.right) rh = child.right.height;
                if (rh>=lh) await this.rotaterr(parent,child,child.right);
                else await this.rotaterl(parent,child,child.left);
            }
            
            parent = parent.parent;

            this.newPosition(this.root, 0, 1);
            this.relativePositionUpdate(this.root);
            this.root.newX = this.constX;
            this.root.newY = this.constY;
            await this.move();
        }
        if (this.root) 
        {
            this.levelorder(this.root);
            document.getElementById('in').innerHTML = "Inorder: ";
            this.inorder(this.root);

            this.newPosition(this.root, 0, 1);
            this.relativePositionUpdate(this.root);
            this.root.newX = this.constX;
            this.root.newY = this.constY;
            await this.move();
        }
    }

    canvas_arrow(context, fromx, fromy, tox, toy) {
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
      }

    

    async drawInsert(node) {
        let canvas = document.getElementById('board');
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(node.x,node.y,node.radius,0,2*Math.PI);
        if (node.parent) this.canvas_arrow(ctx,(3*node.parent.x+node.x)/4,(3*node.parent.y+node.y)/4,(node.parent.x+3*node.x)/4,(node.parent.y+3*node.y)/4);
        ctx.stroke();
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, node.x, node.y);
    }
}

var newTree = new avlTree();
