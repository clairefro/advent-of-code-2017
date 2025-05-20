use std::fs;


fn load_to_str(path: &str) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}

// ----------------------------------


fn match_sum(arr: &[i32], offset: usize) -> i32 {
    let mut sum = 0;
    for i in 0..arr.len() {
        if arr[i] == arr[(i + offset) % arr.len()] {
            sum += arr[i];
        }
    }
    sum
}

fn main () {
    let path = "input.txt";
    
    match load_to_str(path) {
        Ok(contents) => {

            let numbers: Vec<i32> = contents
                .trim()
                .chars()
                .filter_map(|c| c.to_digit(10))
                .map(|d| d as i32)
                .collect();

            println!("pt1: {}", match_sum(&numbers, 1));
            println!("pt2: {}", match_sum(&numbers, numbers.len()/2));


        }
        Err(e) => {
            eprintln!("{}", e)
        }

    }
}