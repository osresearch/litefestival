To add a sketch to the cycle, create `foo.js` with:

```
sketches.push(function(){

// setup code goes here
let t = 0;

// drawing code goes here
return function(){
	background(0);
	stroke(t,0,256-t);
	line(0,0,t,1080);
	t = (t + 1) % 1920;
}});
```

And then add it to the `index.html` with the others:
```
  <script language="javascript" type="text/javascript" src="foo.js"></script>
```


TODO: fixup the QR codes assignment; move them into the draw functions?
