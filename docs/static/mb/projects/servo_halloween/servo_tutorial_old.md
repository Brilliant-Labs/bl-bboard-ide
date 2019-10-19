# How to Code a Servo
# Or Shake a Foam Tombstone

![alt text](https://media.giphy.com/media/icJ13X7EH26szQrH2L/giphy.gif "For more info: www.brilliantlabs.ca")
Servos are a great way to add motion to your project. They are similiar to a motor that turns a wheel, however they can stop at very precise positions while they turn.

You may have learned in math that a wheel is like a circle and
spins using rotations that are measured using a unit called a degree. Remember there are 360 degrees in a circle. However, a servo only turns 180 degrees.

It is important to know approximately how far you would like your sevo to turn the object attached to the horn. For this project, we will be attaching a foam tombstone prop so that
as people walk by, the halloween tombstone shakes back and forth.

## STEP 1
For our **purposes** we want the servo to cause the tombstone to shake back and forth forever. Unless you choose otherwise, all of your blocks will be placed in the ``||basic:forever||`` block. Like the colour of this text indicates, that can be found in the ``||basic:basic||`` category.

```blocks
basic.forever(function () {

})
```
## STEP 2
While it is true that your servo can turn 180 degrees, you will likely only need a few degrees to spin your tombstone. Nevertheless, it is often helpful to see the servo spin all the way so that you can determine which degree range is best for you. The blocks you will need are found in the ``||advanced:pins||`` category. Try this: 

```blocks
basic.forever(function () {

pins.servoWritePin(AnalogPin.P0, 180)

})
```
There are two values you require: 
 1. Which pin your servo is connected to on the bBoard;
 2. The angle at which you wish your servo to stop. 

**1.** You can identify the first value by looking at the b.Board and identifying the pin number. For this example I am going to use ``||pins:P2||`` to connect the servo. 
![Test](https://github.com/Brilliant-Labs/bboard-tuts/blob/master/servo_pin_number.jpeg?raw=true_)

**2.** For the angle, it is best that you start with 180 degrees so that you can see how farthest point possible for your servo to turn. 

```blocks
basic.forever(function () {

pins.servoWritePin(AnalogPin.P2, 180)

})
```
## STEP 3

Hook up your servo, ``||download:download||`` and try your code! The b.Board has some symbols to help you to identify the location for each wire. Most micro servos, will have a brown, red and orange wire. Remember the rhyme **brown and ground** to easily orient your servo hookup. 

![enter image description here](https://github.com/Brilliant-Labs/bboard-tuts/blob/master/IMG_4239.jpg?raw=true)

### Some Tips

 1. **Did your servo move?** There is a chance that your servo was already in the 180 degree position. If that is the case, when you ran your code, the servo would have already been at that position and therefore not move. 
 2. **Is your servo buzzing?** As soon as you feel your servo buzz, you will know that it is hooked-up correctly. If not, check your pin connection. 

# STEP 4
### Timing can be Tricky
At this point you are likely ready to finish your servo spinning / tombstone effect. Remember, when code runs, it runs linerally (top to bottom) at zero delay between the blocks. This is different from the servo which takes time to move its little plastic gears to your desired degree location. Therefore, you may want to put in some delays as your servo rotates. **Seconds are measured in milliseconds.**

```blocks
basic.forever(function () {
pins.servoWritePin(AnalogPin.P2, 180)
basic.pause(1000)
pins.servoWritePin(AnalogPin.P2, 0)
basic.pause(1000)
pins.servoWritePin(AnalogPin.P2, 180)
})
```
![ServoTurn 1 Second Delay](https://media.giphy.com/media/mEz5fAgNXxFVj75ZyH/giphy.gif)

# STEP 5
Have some fun and attach what ever needs turning to your servo horn. Maybe you want your servo to be extra jittery. Consider using the ``||logic:random||`` blocks for the timing and rotation. 

## HAPPY MAKING. 
Remember to tweet your progress @brilliant_labs and hashtag #makeSomethingBrilliant.


