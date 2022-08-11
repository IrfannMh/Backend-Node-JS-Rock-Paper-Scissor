const { User, Game, GameHistory } = require('../models');

exports.createRoom = async function (req, res) {
  const group = await Game.create({
    room: req.body.room,
    userId1: req.user.id
  });
  // console.log(req.user.id)
  await GameHistory.create({
    gameId:group.id
  })

  res.status(201).send({
    status: "OK",
    message: "Room Created",
    data: group
  })
}

exports.getAll = async function (req, res) {
  const groups = await Game.findAll();

  res.status(201).send({
    status: "OK",
    data: {
      groups
    }
  })
}

exports.join = async function (req, res) {
  const roomId = req.params.id;
  const user = await User.findOne({
    where: { id: req.user.id },
  });

  if (user) {
    const room = await Game.findOne({ where: { id: roomId } });
    if (room.userId1 === user.id || room.userId2 === user.id) {
      res.status(400).send({
        status: "Fail",
        message: "Player already in room",
      });
    } else if(room.userId2){
      res.status(400).send({
        status:"Fail",
        message: "Room is full",
      })
    } else {
      await Game.update(
        { userId2: user.id}
        ,
        { where: { id: roomId } }
      ).then(() =>
        res.status(200).send({
          status:"OK",
          message: "player 2 joined room",
        })
      );
    }
  } else {
    res.status(400).send({
      status: "error",
      message: "User not found",
    });
  }
}

exports.play = async (req,res)=>{
  const gameId = req.params.id;
  const room = await Game.findOne({
    where:{id:gameId}
  });
  const user = req.user.id;
  const option = req.body.option;

  const choice = ["P","R","S"];

  console.log(room)
  if(!choice.includes(option)){
    res.status(400).send({
      status:"Fail",
      message:"Please insert P as paper, R as rock, and S as scissor"
    })
  }

  if(!room) res.status(404).send({
    status:"Fail",
    message:"Room not found"
  })

  if(user != room.userId1 && user != room.userId2 ){
    res.status(404).send({
    status:"Fail",
    message:"Not player in the room"
    })
  }

  let copy = [...room.option]
  if (copy.every((pick) => pick != "")){
    res.status(400).send({
      status:"Fail",
      message:"Room has been finished.",
    });
  } else {
    if(user == room.userId1){
      for (let index = 0; index < 6; index += 2) {
        if(copy[index] == ""){
          copy[index] = option;
          console.log(index)
          console.log("user1",copy)
          break;
        }
      }
    }else if(user == room.userId2){
      for (let index = 1; index < 6; index += 2) {
        if(copy[index] === ""){
          copy[index] = option;
          console.log(index)
          console.log("user2",copy)
          break;
        }
      }
    }
  }
  await Game.update(
    {option:copy},
    {where:{id:gameId}}
  )
  .then(()=>{
    res.status(200).send({
      status:"OK",
      message:"Already choose",
      option: copy
    })
  })
} 

exports.resultGame = async (req,res) =>{
  const room = await Game.findOne({
    where:{id:req.params.id}
  })
  const win = await GameHistory.findOne({
    where:{gameId:room.id},
    include:[Game]
  })
  if(!room)
    res.status(400).send({
      status: "error",
      message: "Room not found",
    })
  const winner = (option) =>{
    let merge = option.join('')
    console.log(merge)

    switch (merge) {
      case "RR":
      case "PP":
      case "SS":
        return "DRAW";
      case "RS":
      case "PR":
      case "SP":
        return "PLAYER 1 WIN";
      case "SR":
      case "RP":
      case "PS":
        return "PLAYER 2 WIN";
      default:
        return "Please wait player 1 or player 2 to choose ";
    }
  }
  
  let copyRes = [...win.result]
  // console.log(copyRes)
  let winnerIs = "";
  if (room.option.every((pick) => pick != "")){
    for (let index = 0; index <3; index++) {
      if(index == 0){
        winnerIs = winner(room.option.slice(0,2));
        copyRes[index]= winnerIs;
      }else if(index == 1){
        winnerIs = winner(room.option.slice(2,4));
        copyRes[index]= winnerIs;
      }else{
        winnerIs = winner(room.option.slice(4,6));
        copyRes[index]= winnerIs;
      }
    }
  } else{
    res.status(400).send({
      status:"Fail",
      message:"Game still running. Please end the game before see result",
    });
  }
  // console.log(copyRes)
  await GameHistory.update(
      {result:copyRes}
    ,{where:{gameId:room.id}}
    )
    .then(()=>{
      res.status(200).send({
        status:"OK",
        data:win
      })
    })
}

exports.allResult = async (req,res)=>{
  const resultAll = await GameHistory.findAll({
    includes:Game
  })
  res.status(200).send({
    status:"OK",
    message: "get result success",
    data : resultAll 
  })
}