from maze_solving import maze_solving
from  generate_maze import maze_generate
gen=maze_generate()
sol =maze_solving()
maze =gen.DBF(5)
all,s_e=sol.DBF(maze.tolist(),(1,1))


# print(s_e)
# print("=================")
# print(all)

for lin in maze:
    for col in lin:
        if col==1:
            print(' # ',end="")
        if col==2 or col==3:
            print(' * ',end="")
        if col==0:
            print('   ',end="")

    print()






