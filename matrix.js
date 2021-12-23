sketches.push(function() {
	let input = "emit dellif nwod meht thgir llef nettirw egdelwonk nwod ailartsua serutcip tnemom sdrawretfa nwod taerg tibbar netsil ytnelp thguoht ecila sedis erehwemos ytinutroppo etiuq elohtibbar niaga ecila dias ecila ecila flesreh eurt nwod hcus revo kniht ylneddus gniwohs demees tnew htiw retfa ecila llahs drawnwod ecila ecila tekcoptaoctsiaw raeh sevlehskoob dleif gninrub elohtibbar tndluow dalg elttil tnarongi erehwemos tibbar ecila tibbar rednu sdrow madam eganam dnim gnillaf edutignol ecila ycnafekops tnrael raen llew ecno tuoba ylwols nwod gniog moorloohcs nwod eruoy ecila dellebal hguoht lrig nees pord nehw dlrow esaelp tsuj eman rehtar spahrep ylekil nwod rehtie raef tekcoptaoctsiaw ekat neve nwod duola gniksa txen ecila hguorht ecitcarp dnarg yltneserp tsum esuoh erofeb elohtibbar egral tnemtnioppasid ecila tsap nwod sevlehs drow ecila derrucco nwod tibbar tros ecila emoc gnilbmut egdeh dluoc htrae dnuos rehtie ertnec yrev edalamram ecila nwod deirt hcum nwod emoh ekil koot llew doog ecila sgniht otni derednow emos ecila krad selim elohtibbar dnuof dnalaez gnippots etal nwod neppah ereh larutan evah gnimoc yletanutrof tubecnatsid nehw yeht spam nwod ecin ynam kniht ecila sgep ruof deciton deppid nwod yestruc nwod ssorca nopu nwod egnaro tekcoptaoctsiaw llaf ecila raed ecila dnasuoht tsrif rehtona rieht tndid yrtnuoc gnoma dessap ecila klaw retfa deirruh neht htaenrednu erew kool deganam gnillik gnihton nwod flesreh llits detrats tibbar flesti nwod tibbar tahw wonk ecila hctaw thgiarts ecila tibbar gniyestruc gninetsil morf revo gnihtyna gnihtyna teef hcihw gnuh emit peed gniredisnoc meesynnuf dekool snossel nageb peed yllautca nwod ytisoiruc dehsalf nellaf sdraobpuc llew evarb ydobemos ecila ytpme llew reven rednow seihtapitna thguo htrae edutital aedi ekam lennut ecila gnitteg emit elpoep sriats dluow lareves elbakramer sdaeh";
	let words = input.split(' ');

    let rects = [];
    let rect_w = 175;
    let rect_h = 745 + 336;

    let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0];

	let symbolSize = 30;

	class Symbol {
		constructor(x, y, speed, value, isAccent) {
			this.x = x;
			this.y = y;
			this.speed = speed;
			this.value = value;
			this.visible = true;
			this.isAccent = int(random(0, 5)) == 1;
		}

		rain() {
			if (this.y > rect_h) {
				this.visible = false;
			} else {
				this.y = this.y += this.speed;
			}
		}
	}

	class Stream {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.symbols = [];
			this.isBold = false;

			this.chooseWord();
		}

		chooseWord() {
			this.speed = random(4, 10);
			this.word = words[int(random(0, words.length - 1))] + " " + words[int(random(0, words.length - 1))];
			this.isBold = int(random(0, 5)) == 1;

			for (var i = 0; i <= this.word.length - 1; i++) {
				let symbol = new Symbol(this.x, this.y - (i * symbolSize), this.speed, this.word.substring(i, i + 1));
				this.symbols.push(symbol);
			}
		}

		draw() {
			var _this = this;
			var anyVisible = false;

			this.symbols.forEach(function(symbol) {
				if(symbol.visible) {
					anyVisible = true;
					textSize(40);
					textFont('Courier');

					if(_this.isBold) {
						textStyle(BOLD);
					} else {
						textStyle(NORMAL);
					}

					if(symbol.isAccent) {
						fill(137, 255, 90);
					} else {
						fill(53, 189, 0);
					}
					text(symbol.value, symbol.x + _this.x, symbol.y + _this.y);
					symbol.rain();
				}
			});

			if(!anyVisible) {
				this.chooseWord();
			}
		}
	}

    class Rect {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
			this.numberOfStreams = 3;
			this.streams = [];

			for (let i = 0; i <= this.numberOfStreams - 1; i++){
				let stream = new Stream(0 + (i * symbolSize), this.y);
				this.streams.push(stream);
			}

			for (let i = 0; i <= this.numberOfStreams - 1; i++){
				let stream = new Stream(10 + (i * symbolSize), this.y);
				this.streams.push(stream);
			}
			for (let i = 0; i <= this.numberOfStreams - 1; i++){
				let stream = new Stream(5 + (i * symbolSize), this.y);
				this.streams.push(stream);
			}
        }

        draw() {
            push();

            // stroke(255, 204, 0);
			// noFill();
			// rect(this.x, this.y, this.w, this.h);

			noStroke();
            translate(this.x, this.y);

			// console.log(`rect ${this.x}, ${this.y}, ${this.streams.length} streams`);
			
			this.streams.forEach(function(stream) {
				stream.draw();
			});

            pop();
        }
    }

    for (let x of x_coords) {
        for (let y of y_coords)
            rects.push(new Rect(x, y, rect_w, rect_h));
    }

    return function() {
        background(0);

        for (let r of rects)
            r.draw();
    }
});