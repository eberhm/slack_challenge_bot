import { ViewOutput } from '@slack/bolt';

export const parseResponse = (values: Object) => {
    const result = Object
        .values(values)
        .reduce((prev, input) => {
                const keyValPair = (Object.values(input)[0] as any);
                const type = keyValPair.type;
                let value;

                switch (type) {
                    case 'users_select':
                        console.log(keyValPair);
                        value = keyValPair.selected_user;
                        break;
                    case 'static_select':
                        console.log(keyValPair);
                        value = keyValPair.selected_option.value
                        break;
                    default:
                        value = keyValPair.value;
                        break;
                }
                    
                prev[Object.keys(input)[0]] = value;
            
                return prev;
            }, {});

    console.log(result);

    return result;
};