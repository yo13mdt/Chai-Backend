import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessandRefreshTokens = async (userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};

  }catch(error) {
    throw new ApiError('Something went wrong while generating access and refresh token', 500);
}
}

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images or avartar
  // upload them to cloudinary,avatar
  // create user object - create entry in database
  // remive password and rrefresh token from response
  // check for user crreation
  // return response


  const {fullName, username, email, password} = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError('All fields are required', 400);
  }

  const existedUser = await User.findOne({$or: [{email}, {username}]
  })

  if(existedUser) {
    throw new ApiError('User already exists', 409);
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImages?.[0]?.path;

  if(!avatarLocalPath )  {
    throw new ApiError('Avatar is required', 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);


  if (!avatar) {
    throw new ApiError('Failed to upload avatar', 400);
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser  = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError('something went wrong while registering the user', 500);
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req,res) => {
  // req.body = data
  // username, email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const {email, username,password} = req.body;

  if (!username || !email) {
    throw new ApiError('Username or email is required', 400);
  }

   await  User.findOne({$or: [{email}, {username}]})

   if (!user) {
    throw new ApiError('User not found', 404);
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
    throw new ApiError('Invalid user credentials', 401);
   }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, 
      {
        user: loggedInUser,
        accessToken,
        refreshToken
      },
      "User logged in successfully")
      )


      const logoutUser = asyncHandler(async (req, res) => {
        // 





})

export { registerUser, loginUser };
