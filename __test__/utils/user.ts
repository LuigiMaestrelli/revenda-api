import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';
import UserModel from '@/infra/db/model/user/userModel';
import config from '@/main/config';
import { UserWithAuthAttributes } from '@/domain/models/user/user';

const STRONG_PASSWORD = '^znET!St5+.PXgtZ';

export async function generateValidUserData(): Promise<UserWithAuthAttributes> {
    const bcryptAdapter = new BcryptAdapter();
    const hashedPassword = await bcryptAdapter.hash(STRONG_PASSWORD);
    const jwtAdapter = new JwtAdapter(
        config.getTokenSecretTokenKey(),
        config.getTokenSecretRefreshTokenKey(),
        config.getTokenSecretExpires()
    );

    const id = uuidv4();

    const user = await UserModel.create({
        id: id,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: hashedPassword
    });

    const auth = await jwtAdapter.sign({
        userId: id
    });

    return {
        user: user,
        auth: auth
    };
}
