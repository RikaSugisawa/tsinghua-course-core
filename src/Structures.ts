export class OpeningInfo {
    Department: string
    No: string
    Index: number
    Name: string
    Credit: number
    Teacher: string
    CapacityU: number//本科生容量
    CapacityM: number//研究生容量
    Time: string
    Remark: string
    Feature: string
    Grade: number
    SecondaryElection: boolean

    constructor(arg: ArrayLike<string>) {
        this.Department = arg[0]
        this.No = arg[1]
        this.Index = Number(arg[2])
        this.Name = arg[3]
        this.Credit = Number(arg[4])
        this.Teacher = arg[5]
        this.CapacityU = Number(arg[6])
        this.CapacityM = Number(arg[7])
        this.Time = arg[8]
        this.Remark = arg[9]
        this.Feature = arg[10]
        this.Grade = Number(arg[11])
        this.SecondaryElection = arg[12] == "是"
    }
}

export class RemainInfo {
    No: string
    Index: number
    Name: string
    Capacity: number//本科生容量
    Remaining: number
    Queue: number
    Teacher: string
    Time: string

    constructor(arg: ArrayLike<string>) {
        this.No = arg[0]
        this.Index = Number(arg[1])
        this.Name = arg[2]
        this.Capacity = Number(arg[3])
        this.Remaining = Number(arg[4])
        this.Queue = Number(arg[5])
        this.Teacher = arg[6]
        this.Time = arg[7]
    }

}
