
enum IRSensor {
    //% block="left"
    LEFT = 7,
    //% block="middle"
    MIDDLE = 8,
    //% block="right"
    RIGHT = 9
}

enum IRColour {
    //% block="black"
    BLACK,
    //% block="white"
    WHITE
}
enum Motor {
    //% block="left"
    LEFT = 0,
    //% block="right"
    RIGHT = 1
}

enum MotorDirection {
    //% block="forward"
    FORWARD = 0,
    //% block="reverse"
    REVERSE = 1
}

enum MotorPower {
    //% block="on"
    ON,
    //% block="off"
    OFF
}
enum Comparison {
    //% block="closer"
    CLOSER,
    //% block="further"
    FURTHER
}



//% weight=0 color=#421C52 icon="\uf1b9"
//% advanced=true

namespace k8 {
    export let IR_SENSOR_LEFT = AnalogPin.P0
    export let IR_SENSOR_MIDDLE = AnalogPin.P1
    export let SPEAKER = AnalogPin.P1
    export let IR_SENSOR_RIGHT = AnalogPin.P2
    export let SERVO_2 = AnalogPin.P8
    export let SONAR = DigitalPin.P8
    export let SERVO_1 = AnalogPin.P12
    export let M2_PWR: number = DigitalPin.P13
    export let M2_DIR: number = DigitalPin.P14
    export let M1_PWR: number = DigitalPin.P15
    export let M1_DIR: number = DigitalPin.P16



    //----line sensor ----
    /**
   * Check if a chosen sensor is reading black or white
   * @param sensor which of the three sensors
   * @param colour whether the sensor looks for black or white
   */
    //% block
    //% blockId=line_check_sensor block="%sensor| sensor is %colour|"
    //% weight=60
    export function checkSensor(sensor: IRSensor, colour: IRColour = IRColour.WHITE): boolean {
        let read: boolean
        switch (sensor) {
            case IRSensor.LEFT:
                read = pins.analogReadPin(k8.IR_SENSOR_LEFT) > 200
                break
            case IRSensor.MIDDLE:
                read = pins.analogReadPin(k8.IR_SENSOR_MIDDLE) > 200
                break
            case IRSensor.RIGHT:
                read = pins.analogReadPin(k8.IR_SENSOR_RIGHT) > 200
                break
        }
        if (colour == IRColour.WHITE) {
            return !read
        }
        return read
    }

    /**
     * Displays current status of all line sensors
     */

    //% groups=" 'Line Sensor, 'Motion', 'Sonar',"

    //%blockId=Line_Sensor
    //%block="Display Line Sensor Current Status"
    //%block="Display Current Status"
    //%group="Line Sensor"
    //% weight=50

    export function displaySensors(): void {
        let i: number
        for (i = 0; i < 5; i++)
            led.plot(i, 4)

        if (checkSensor(IRSensor.LEFT)) {
            plotBar(4)
        } else {
            unplotBar(4)
        }

        if (checkSensor(IRSensor.MIDDLE)) {
            plotBar(2)
        } else {
            unplotBar(2)
        }

        if (checkSensor(IRSensor.RIGHT)) {
            plotBar(0)
        } else {
            unplotBar(0)
        }
    }

    function plotBar(x: number) {
        led.plot(x, 1)
        led.plot(x, 2)
        led.plot(x, 3)
    }
    function unplotBar(x: number) {
        led.unplot(x, 1)
        led.unplot(x, 2)
        led.unplot(x, 3)
    }


 let MAX_PULSE = 7800

    /**
    * Returns the distance the robot is from an object (in centimetres)
    * Max range 150cm
    */
    //% block
    //% group="Sonar"
    //% weight=50
    export function checkSonar(): number {
        let list = [0, 0, 0, 0, 0];

        for (let index = 0; index <= 4; index++) {
            list[index] = ping()
        }
        list = list.sort()

        return list[2];
    }

    /**
     * Test that sonar is closer or further than the threshold in cm.
     */
    //% block
    //% group="Sonar"
    //% blockId=sonar_is block="sonar is %comparison| than %threshold cm"
    //% weight=60
    export function isSonar(comparison: Comparison = Comparison.FURTHER, threshold: number): boolean {
        let distance = checkSonar()
        if (comparison == Comparison.FURTHER) {
            return threshold < distance || distance == 0
        } else {
            return threshold >= checkSonar()
        }
      }

    /**
    * Display the current sonar reading to leds.
    */
    //% block
    //% group="Sonar"
    //% weight=40
    export function displaySonar(): void {
        led.plotBarGraph(checkSonar(), 80)
    }

    // d / 39 is the ratio that most resembled actual centimeters
    // The datasheet says use d / 58 but that was off by a factor of 2/3
    function ping(): number {
        // send pulse
        pins.setPull(k8.SONAR, PinPullMode.PullNone);
        pins.digitalWritePin(k8.SONAR, 0);
        control.waitMicros(2);
        pins.digitalWritePin(k8.SONAR, 1);
        control.waitMicros(10);
        pins.digitalWritePin(k8.SONAR, 0);

        // read pulse
        const d = pins.pulseIn(k8.SONAR, PulseValue.High, MAX_PULSE);
        return Math.min(150, d / 39)
    }


let motorState: MotorPower = MotorPower.ON

/**
 *Drives the robot straight at a specified speed
    */
    //% block
    //% group="Motion"
    //% blockId=motion_drive_straight block="drive straight |speed: %speed"
    //% speed.min=-100 speed.max=100
    //% weight=70
export function driveStraight(speed: number): void {
    motorControl(Motor.LEFT, speed)
    motorControl(Motor.RIGHT, speed)
}

/**
 *Turns the robot to the left at a specified speed
    */
    //% block
    //% group="Motion"
    //% blockId=motion_turn_left block="turn left |speed: %speed"
    //% speed.min=0 speed.max=100
    //% weight=60
export function turnLeft(speed: number): void {
    motorControl(Motor.LEFT, 0)
    motorControl(Motor.RIGHT, speed)
}

/**
 *Turns the robot to the right at a specified speed
    */
    //% block
    //% group="Motion"
    //% blockId=motion_turn_right block="turn right |speed: %speed"
//% speed.min=0 speed.max=100
//% weight=50
export function turnRight(speed: number): void {
    motorControl(Motor.LEFT, speed)
    motorControl(Motor.RIGHT, 0)
}

/**
 *Stop the motors
    */
    //% block
    //% group="Motion"
    //% blockId=motion_stop block="stop motors"
//% weight=45
export function stop(): void {
    motorControl(Motor.LEFT, 0)
    motorControl(Motor.RIGHT, 0)
}

/**
* Control both wheels in one function.
* Speeds range from -100 to 100.
* Negative speeds go backwards, positive go forwards.
*/
//% block
//% group="Motion"
//% blockId=motion_drive block="drive |left: %leftWheelSpeed|right: %rightWheelSpeed"
//% leftWheelSpeed.min=-100 leftWheelSpeed.max=100
//% rightWheelSpeed.min=-100 rightWheelSpeed.max=100
//% weight=40
//% advanced=false
export function drive(leftWheelSpeed: number, rightWheelSpeed: number): void {
    motorControl(Motor.LEFT, leftWheelSpeed)
    motorControl(Motor.RIGHT, rightWheelSpeed)
}

/**
* Control the speed and direction of a single wheel
*/
//% block
//% group="Motion"
//% blockId=motion_single block="drive |wheel: %wheel|speed: %speed"
//% speed.min=0 speed.max=100
//% weight=30
//% advanced=false
export function driveWheel(wheel: Motor, speed: number): void {
    motorControl(wheel, speed)
}

/**
* Turn the motors on/off - default on
*/
//% block
//% group="Motion"
//% blockId=motion_power block="turn motors |power: %power"
//% weight=20
//% advanced=false
export function setPowers(power: MotorPower): void {
    if (power == MotorPower.OFF) {
        k8.stop()
    }
    motorState = power
}

/**
 * Advanced control of an individual motor. PWM is set to constant value.
 */
function motorControl(whichMotor: Motor, speed: number): void {
    let motorSpeed: number
    let direction: MotorDirection

    if (motorState == MotorPower.OFF) {
        return
    }

    direction = speed < 0 ? MotorDirection.REVERSE : MotorDirection.FORWARD
    speed = Math.abs(speed)

    motorSpeed = remapSpeed(speed)

    if (whichMotor == Motor.LEFT) {
        pins.digitalWritePin(k8.M1_DIR, direction)
        pins.analogSetPeriod(k8.M1_PWR, 512)
        pins.analogWritePin(k8.M1_PWR, motorSpeed)
    } else {
        pins.digitalWritePin(k8.M2_DIR, direction)
        pins.analogSetPeriod(k8.M2_PWR, 512)
        pins.analogWritePin(k8.M2_PWR, motorSpeed)
    }
}

// Rescale values from 0 - 100 to 0 - 1023
function remapSpeed(s: number): number {
    let returnSpeed: number
    if (s <= 0) {
        returnSpeed = 0
    } else if (s >= 100) {
        returnSpeed = 1023
    } else {
    returnSpeed = (23200 + (s * 791)) / 100
    }
    return returnSpeed;
}
}






