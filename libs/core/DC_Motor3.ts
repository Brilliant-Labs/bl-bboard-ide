



//% weight=100 color=#EF697B icon=""
//% advanced=true

namespace DC_Motor3 {

//Motor Click
let IN1 = clickIOPin.AN
let IN2 = clickIOPin.RST
let  SLP = clickIOPin.CS
let  PWM = clickIOPin.PWM


export enum MotorDirection {
    //% block="Forward"
    Forward,
    //% block="Reverse"
    Reverse
}



    //------------------------Motor Click---------------------------------


    //% blockId=Motor_speed
    //% block="Motor speed %Speed on click%clickBoardNum"
    //% Speed.min=0 Speed.max=100
    //% group="Operation"
    //% weight=60 color=#0fbc11
    export function motorSpeed(Speed: number,clickBoardNum: clickBoardID): void {
        
        if (Speed > 100) {
            Speed = 100;
        }
        if (Speed < 0) {
            Speed = 0;
        }
        bBoard.PWMOut(clickPWMPin.PWM,Speed,clickBoardNum);
       
    }

    //% blockId=Motor_direction
    //% block="Motor rotation %direction on click%clickBoardNum"
    //% group="Operation"
    //% weight=60 color=#0fbc11
    export function motorRotation(direction: MotorDirection, clickBoardNum: clickBoardID): void {
        switch (direction) {

            
            case MotorDirection.Forward:
            bBoard.writePin(1,IN1,clickBoardNum);
            bBoard.writePin(0,IN2,clickBoardNum);
        
                break;

            case MotorDirection.Reverse:
            
            bBoard.writePin(0,IN1,clickBoardNum);
            bBoard.writePin(1,IN2,clickBoardNum);
                break;
        }
    }

  

}