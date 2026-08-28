import Project from "../models/Project.js";


// CREATE PROJECT

export const createProject =
  async (req, res) => {

    try {

      const project =
        await Project.create(
          req.body
        );


      res.status(201).json({

        success: true,

        message:
          "Project created successfully",

        data:
          project,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// GET PROJECTS

export const getProjects =
  async (req, res) => {

    try {

      const projects =
        await Project.find()

          .populate(
            "manager",
            "name email"
          )

          .populate(
            "team",
            "name email"
          )

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        count:
          projects.length,

        data:
          projects,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// UPDATE PROJECT

export const updateProject =
  async (req, res) => {

    try {

      const project =
        await Project.findByIdAndUpdate(

          req.params.id,

          req.body,

          {

            new: true,

          }

        );


      if (!project) {

        return res.status(404).json({

          success: false,

          message:
            "Project not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Project updated successfully",

        data:
          project,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// DELETE PROJECT

export const deleteProject =
  async (req, res) => {

    try {

      const project =
        await Project.findByIdAndDelete(

          req.params.id

        );


      if (!project) {

        return res.status(404).json({

          success: false,

          message:
            "Project not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Project deleted successfully",

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };