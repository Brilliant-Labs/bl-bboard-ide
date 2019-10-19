
### @activities true

# Neopixels + Button_G
# ACTIVATE YOUR DANCE ON

![alt text](\docs\static\mb\projects\button-g\button_A.gif "For more info: www.brilliantlabs.ca")

Do you have this great, ultra luminous, neopixel project but no way of intiating your code? Look no further than the Button G ClickBoardTM. The Button G can be extended with our Expasion board from your bBoard to really get the light show started. Not only does the Button G have a very satisfying push, it also has an onboard LED to lure your party goers to push that button that is just waiting to be pushed. Happy Coding!

## STEP 1
**Plan your install.** Neopixels are really brilliant, but they do require some thought. Since each neopixel is indvidually addressable, which colour do you want, where does it appear on the strip, and how long will it be illuminated? Other questions to consider may include: 

 - How many neopixels do you require? 
 - Neopixel brightness? 
 - Does the light need to be diffused? 
 - Should I use a neopixel strip, ring, bare, breadboard, or some other variant? 
 - Will this installation need to last a while? Should you use the b.Board Gator Grabbers, the b.Board terminal blocks or maybe solder to the b.Board itself for a more permanent installation? 
 - How far will the Button G need to be from your b.Board? 
 - Any other ideas...

## STEP 2
**What is your project's < HELLO WORLD / > ?** 
When prototyping your code, it is great to start off with something that you know will work. The final version of your code will likely be extraordinarly complex - so don't stress yourself out - get motivated by starting with a simple set of blocks to get your project up and going. 

## Initialize your Neopixels
As brilliant as you belive your micro:bit and b.Board are, regrettably they are not. Should you just hook your neopixles to the Gator Grabbers and apply power to your b.Board and expect the neopixels to illuminate, you will be sadly mistaken. You must tell your micro:bit and b.Board where those neopiels are, how many are attached in sequence and their type. 
To do this, follow these steps: 

 1. Under ``||Advanced||`` click the ``||Neopixel||`` category to reveal all your neopixel options. The following photo depicts an example strip setup. 
 ![enter image description here](https://github.com/Brilliant-Labs/bboard-tuts/blob/master/Neopixel+Button_G/neopixel_start_basic.png?raw=true)

 2. Choose a simple light pattern to send to your neopixel strip to discover if you have indeed initialized your strip correctly. Your sample code may resemble these blocks: 

```blocks
let strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
strip.setBrightness(100)
basic.forever(function () {
if (input.buttonIsPressed(Button.A)) {
strip.showColor(neopixel.colors(NeoPixelColors.Purple))
} else {
strip.showColor(neopixel.colors(NeoPixelColors.Blue))
}
})
```

 2. If coded correctly, the blocks above should illuminate the strip blue, but when the ``||Button A: Is Pressed||``the strip should turn purple. **NOTE:** If you are running your b.Board off of a battery pack, you will want to reduce your ``||neopixel:more:brightness||``so that you don't need to replace your batteries every hour. Look at that brilliant purple! 
 
 ![alt text](\docs\static\mb\projects\button-g\button_A.gif "For more info: www.brilliantlabs.ca")

## STEP 3
**Click your way to a Button G** Ok, we know that pushing ``||Button A||`` on the micro:bit is pretty neat, but you know what is ~~neater~~ better? Using the following ClickBoardTM. Meet the glorious Button G. 

![alt text](https://github.com/Brilliant-Labs/bboard-tuts/blob/master/Neopixel+Button_G/glowy.gif?raw=true "For more info: www.brilliantlabs.ca")

This button can be setup similar to the code you created for the ``||Button A||``. You may want to consider how far you would like your button to be away from your b.Board. For this you will want to use either our (soon to be released) expansion board, or a [Shuttle Click](https://www.mikroe.com/shuttle-click). 

Use the following code to get your started: 
```blocks
let strip = neopixel.create(DigitalPin.P0, 30, NeoPixelMode.RGB)
strip.setBrightness(100)
basic.forever(function () {
if (Button_G.getSwitch(clickBoardID.one) == 1) {
strip.showColor(neopixel.colors(NeoPixelColors.Purple))
} else {
strip.showColor(neopixel.colors(NeoPixelColors.Blue))
}
})
```
## Some reminders when using the blocks for Button G: 

 1. The depress/press of the button follows the common state of 0/1.
 2. Use the ``||Logic||``category to find the equality function. 
 3. Remember to look at the ClickBoard position you have used on your b.Board. 
 4. Try using the glowing commands to make your install extra glowy. 

![alt text](https://github.com/Brilliant-Labs/bboard-tuts/blob/master/Neopixel+Button_G/button_g_click.png?raw=true "For more info: www.brilliantlabs.ca")

## HAPPY MAKING. 
Remember to tweet your progress @brilliant_labs and hashtag #makeSomethingBrilliant.
