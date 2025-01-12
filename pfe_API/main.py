from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

from  generate_maze import maze_generate
from maze_solving import maze_solving

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
gen=maze_generate()
sol =maze_solving()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#  for data validation 
class coordinate(BaseModel):
    x:int 
    y:int
class mazeModel(BaseModel):
    maze: list [list[int]]
    start: coordinate



@app.get("/generate/{algorithm}/{dim}")
def generate_maze(algorithm: str,dim:int):
    if algorithm == "DFS":
        if dim % 2 == 0 :
            new_dim =  dim+1
        else:
            new_dim=dim
        # dim == 2k + 1
        maze, start , end =gen.DFS(new_dim)
        return  {
                "maze":maze.tolist(),
                "start":start,
                "end":end
                }
    
    return{"error":"algo not find"}

# TODO complete this endpoint
@app.get("/generate_from_img")
def generate_maze_from_img():
    maze = gen.from_img("test3.jpg",127,4).tolist()
    return {"maze":maze}


@app.post("/solve/{algorithm}")
def solve_maze(algorithm: str,maze:mazeModel):
    if algorithm == "DFS":
        steps_to_solution , solution=sol.DFS(maze.maze,(maze.start.x,maze.start.y))
        return {"solution":solution,"steps_to_solution":steps_to_solution}
    return{"error":"algo not find"}




if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8080,reload= True)