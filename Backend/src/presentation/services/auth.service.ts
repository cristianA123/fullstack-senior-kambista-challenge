import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import ResponseDTO from '../../domain/dtos/shared/response.dto';

export class AuthService {

  constructor() {}

  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      user.password = bcryptAdapter.hash( registerUserDto.password );
      
      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: userEntity, 
        token: token,
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }

  }


  public async loginUser( loginUserDto: LoginUserDto ) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');


    const { password, ...userEntity} = UserEntity.fromObject( user );
    
    const token = await JwtAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }

  public async me(user: UserEntity) {

    const response: ResponseDTO = { success: true, message: "Mis datos", data: {} };

    const token = await JwtAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    response.data = {
      user: user,
      token: token,
    }

    return response;

  }

  public validateEmail = async(token:string) => {

    const payload = await JwtAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  }

}