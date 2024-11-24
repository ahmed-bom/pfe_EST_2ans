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



class coordinate(BaseModel):
    x:int 
    y:int
class mazeModel(BaseModel):
    maze: list [list[int]]
    start: coordinate

@app.get("/generate/{algorithme}/{dim}")
def read_root(algorithme: str,dim:int):
    if algorithme == "DFS":
        # new_dim=(dim-1)/2
        maze =gen.DFS(dim)
        return {"maze":maze.tolist()}
    return{"error":"algo not find"}


@app.post("/solve/{algorithme}")
def read_root(algorithme: str,maze:mazeModel):
    if algorithme == "DFS":
        steps_to_solution , solution=sol.DFS(maze.maze,(maze.start.x,maze.start.y))
        return {"solution":solution,"steps_to_solution":steps_to_solution}
    return{"error":"algo not find"}




if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8080,reload= True)